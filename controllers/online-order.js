import { db } from "../utils/db.js";

const onlineOrderController = {
  getOrderPage: async (req, res, next) => {
    try {
      const allAreas = await db("AREA").select("*");
      const redirectUrl = req.baseUrl;

      const urlParts = redirectUrl.split("/").filter(Boolean); // Split by "/" and filter out empty strings

      // Check if the first part exists and use the first part, else fallback to "/"
      const firstPart = urlParts.length > 0 ? `/${urlParts[0]}` : "/"; // If no parts exist, return "/"

      res.render("online-order/select-area", {
        customCSS: ["online_user_home.css", "view.css"],
        layout: redirectUrl === "/in-restaurant" ? "employee" : "main",
        allAreas,
        redirectUrl,
        backUrl: firstPart,
        hasBackButton: firstPart !== redirectUrl,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getAreaPage: async (req, res, next) => {
    const areaId = req.params.areaId;
    try {
      const redirectUrl = req.baseUrl;
      const allBranches = await db("BRANCH")
        .select("*")
        .where("ID_Area", areaId);

      allBranches.forEach((branch) => {
        branch.OpeningHour = branch.OpeningHour.toISOString().slice(11, 16);
        branch.CloseHour = branch.CloseHour.toISOString().slice(11, 16);
      });

      res.render("online-order/select-branch", {
        customCSS: ["online_user_home.css", "view.css"],
        layout: redirectUrl === "/in-restaurant" ? "employee" : "main",
        allBranches,
        redirectUrl: redirectUrl,
      });
    } catch (err) {
      console.log(err);
    }
  },
  getBranchPage: async (req, res, next) => {
    const branchId = req.params.branchId;
    try {
      const redirectUrl = req.baseUrl;

      const branch = await db("BRANCH")
        .select("ID_Area")
        .where("ID_Branch", branchId)
        .first();
      const allFoods = await db("BRANCH_FOOD")
        .select("*")
        .where("ID_Branch", branchId)
        .where("Available", 1)
        .where("DeliverySafe", 1)
        .join("FOOD_ITEM", "BRANCH_FOOD.ID_Food", "FOOD_ITEM.ID_Food");

      res.render("online-order/select-food", {
        cdnJS:
          '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>',
        customCSS: ["online_user_home.css"],
        customJS: ["online-order.js", "priceFormat.js", "close-bill.js"],
        branchId,
        areaId: branch.ID_Area,
        redirectUrl: redirectUrl,
        allFoods,
      });
    } catch (err) {
      console.log(err);
    }
  },
  postOrder: async (req, res, next) => {
    try {
      // get the JSON data
      const data = req.body;
      // extract member id and branchid
      const membershipId = data.membershipId;
      const branchId = data.branchId;
      // get discount percentage
      const memberLevel = await db("MEMBERSHIP")
        .join("MEM_LEVEL", "MEMBERSHIP.ID_Level", "=", "MEM_LEVEL.ID_Level")
        .select("MEM_LEVEL.DiscountPercentages")
        .where("MEMBERSHIP.ID_Card", membershipId)
        .first();
      const discountPercentages = memberLevel?.DiscountPercentages;
      // get customer id
      const customer = await db("CUSTOMER")
        .select("ID_Customer")
        .where("ID_Card", membershipId)
        .first();
      // manually set the order id
      const latestOrder = await db("ORDER").max("ID_Order as maxOrder").first();
      const newOrderId = latestOrder.maxOrder + 1;
      // create order
      const newOrder = {
        ID_Order: newOrderId,
        ID_Table: null,
        TotalPrice: 0,
        ActualPrice: 0,
        ID_Customer: customer ? customer.ID_Customer : null,
        ID_Review: null,
        ID_Employee: null,
        ID_Branch: branchId,
      };
      // insert order to the order table
      await db("ORDER").insert(newOrder);
      // calculate the totalPrice and insert order foods
      let totalPrice = 0;
      let totalAmount = 0;
      const orderFoods = [];
      const cart = data.cart;
      for (const [key, value] of Object.entries(cart)) {
        const foodId = key;
        const quantity = value;

        totalAmount += quantity;

        const branchFood = await db("BRANCH_FOOD")
          .select("ID_BranchFood")
          .where("ID_Food", foodId)
          .where("ID_Branch", branchId)
          .first();

        if (!branchFood) {
          throw new Error(`BranchFood ID not found for FoodID ${foodId}`);
        }

        const foodItem = await db("FOOD_ITEM")
          .select("Price", "FoodName")
          .where("ID_Food", foodId)
          .first();

        if (!foodItem) {
          throw new Error(`Food item not found for FoodID ${foodId}`);
        }
        // get price of food item and calculate amount price
        const foodPrice = Number(foodItem.Price);
        const amountPrice = foodPrice * quantity;
        // add amount price to total price
        totalPrice += amountPrice;
        // create order food with current branchid and quantity for each food item
        const orderFood = {
          ID_BranchFood: branchFood.ID_BranchFood,
          ID_Order: newOrderId,
          Quantity: quantity,
        };
        // this one is for displaying the bill
        const orderFoodBill = {
          price: foodPrice,
          foodName: foodItem.FoodName,
          quantity,
          amountPrice,
        };
        // save orderfood
        await db("ORDER_FOOD").insert(orderFood);
        orderFoods.push(orderFoodBill);
      }
      // calculate actual price based on membership level

      const actualPrice = discountPercentages
        ? totalPrice - (totalPrice * discountPercentages) / 100
        : totalPrice;
      // update total and actual price for order
      await db("ORDER").where("ID_Order", newOrderId).update({
        TotalPrice: totalPrice,
        ActualPrice: actualPrice,
      });

      // create online order
      const onlineOrder = {
        ID_Online: newOrderId,
        TimeOrder: db.raw("CAST(GETDATE() AS TIME)"),
      };
      // save online order
      await db("ONLINE_ORDER").insert(onlineOrder);

      console.log("Inserted new order!"); // process success
      return res.status(201).json({
        message: "Order placed successfully",
        orderId: newOrderId,
        bill: {
          totalAmount,
          totalPrice,
          actualPrice,
          orderFoods,
        },
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  getReviewPage: async (req, res, next) => {
    const orderId = req.params.orderId;

    const redirectUrl = req.baseUrl;

    try {
      const order = await db("ORDER")
        .select("ID_Review")
        .where("ID_Order", orderId)
        .first();

      res.render("review", {
        order,
        pageTitle: "Review",
        layout: "employee",
        customCSS: ["review.css", "online_user_home.css"],
        customJS: ["review.js"], //css and js
        layout: redirectUrl === "/in-restaurant" ? "employee" : "main",
        cdnJS:
          '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>',
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  postReviewPage: async (req, res, next) => {
    const orderId = req.params.orderId;
    const { service, food, branch, price, reviewText } = req.body;
    try {
      const latestReview = await db("REVIEW").max("ID_Review as ID").first();
      const newReviewId = latestReview.ID + 1;
      await db("REVIEW").insert({
        ID_Review: newReviewId,
        ServiceScore: Number(service),
        FoodScore: Number(food),
        BranchScore: Number(branch),
        PriceScore: Number(price),
        Comment: reviewText,
      });
      await db("ORDER").where("ID_Order", orderId).update({
        ID_Review: newReviewId,
      });
      res.status(201).redirect(req.originalUrl);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

export default onlineOrderController;
