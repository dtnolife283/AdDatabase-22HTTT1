import { db } from "../utils/db.js";

const inRestaurantController = {
  getBranchPage: async (req, res, next) => {
    const branchId = req.params.branchId;
    try {
      const branch = await db("BRANCH")
        .select("ID_Area")
        .where("ID_Branch", branchId)
        .first();
      const allFoods = await db("BRANCH_FOOD")
        .select("*")
        .where("ID_Branch", branchId)
        .where("Available", 1)
        .join("FOOD_ITEM", "BRANCH_FOOD.ID_Food", "FOOD_ITEM.ID_Food");

      res.render("online-order/select-food", {
        cdnJS:
          '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>',
        customCSS: ["online_user_home.css"],
        customJS: ["in-restaurant.js", "priceFormat.js", "close-bill.js"],
        branchId,
        areaId: branch.ID_Area,
        allFoods,
        redirectUrl: req.baseUrl,
        inRestaurant: true,
      });
    } catch (err) {
      console.log(err);
    }
  },
  postOrder: async (req, res, next) => {
    try {
      const data = req.body;
      const membershipId = data.membershipId;
      const branchId = data.branchId;
      const tableId = data.tableId;

      const table = await db("TABLE")
        .select("ID_Table")
        .where("ID_Table", tableId)
        .where("ID_Branch", branchId)
        .first();

      if (!table) {
        return res.status(400).json({ message: "Table not found" });
      }
      // Fetch discount percentage
      const memberLevel = await db("MEMBERSHIP")
        .join("MEM_LEVEL", "MEMBERSHIP.ID_Level", "=", "MEM_LEVEL.ID_Level")
        .select("MEM_LEVEL.DiscountPercentages")
        .where("MEMBERSHIP.ID_Card", membershipId)
        .first();
      const discountPercentages = memberLevel?.DiscountPercentages;

      // Fetch customer ID
      const customer = await db("CUSTOMER")
        .select("ID_Customer")
        .where("ID_Card", membershipId)
        .first();

      let newOrderId;

      // Create a new order if not provided
      if (!data.orderId) {
        const latestOrder = await db("ORDER")
          .max("ID_Order as maxOrder")
          .first();
        newOrderId = (latestOrder.maxOrder || 0) + 1;

        const newOrder = {
          ID_Order: newOrderId,
          ID_Table: table?.ID_Table,
          TotalPrice: 0,
          ActualPrice: 0,
          ID_Customer: customer ? customer.ID_Customer : null,
          ID_Review: null,
          ID_Employee: null,
          ID_Branch: branchId,
        };

        await db("ORDER").insert(newOrder);
      } else {
        newOrderId = data.orderId;
      }

      // Process the cart
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

        const foodPrice = Number(foodItem.Price);
        const amountPrice = foodPrice * quantity;
        totalPrice += amountPrice;

        const existingOrderFood = await db("ORDER_FOOD")
          .select("Quantity")
          .where("ID_BranchFood", branchFood.ID_BranchFood)
          .where("ID_Order", newOrderId)
          .first();

        if (existingOrderFood) {
          // Update the quantity if it already exists
          const newQuantity = existingOrderFood.Quantity + quantity;
          await db("ORDER_FOOD")
            .where("ID_BranchFood", branchFood.ID_BranchFood)
            .where("ID_Order", newOrderId)
            .update({ Quantity: newQuantity });
        } else {
          // Insert new order food
          const orderFood = {
            ID_BranchFood: branchFood.ID_BranchFood,
            ID_Order: newOrderId,
            Quantity: quantity,
          };
          await db("ORDER_FOOD").insert(orderFood);
        }

        // Build the orderFoods array for the bill
        const orderFoodBill = {
          price: foodPrice,
          foodName: foodItem.FoodName,
          quantity,
          amountPrice,
        };
        orderFoods.push(orderFoodBill);
      }

      // Calculate actual price based on discount
      const actualPrice = discountPercentages
        ? totalPrice - (totalPrice * discountPercentages) / 100
        : totalPrice;

      // Update the order's total and actual prices
      await db("ORDER").where("ID_Order", newOrderId).update({
        TotalPrice: totalPrice,
        ActualPrice: actualPrice,
      });

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
};

export default inRestaurantController;
