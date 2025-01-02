import { db } from "../utils/db.js";

const orderController = {
  getOrders: async (req, res) => {
    const { startDate, endDate, sort, customerId } = req.query;

    try {
      let query = db("ORDER").select("*");
      if (customerId) {
        query = query.where("ID_Customer", customerId);
      }
      const customers = await db("CUSTOMER").select(
        "ID_Customer",
        "CustomerName"
      );

      if (startDate && endDate) {
        // Both dates are provided
        query = query.whereBetween("OrderDate", [startDate, endDate]);
      } else if (startDate) {
        // Only startDate is provided
        query = query.where("OrderDate", ">=", startDate);
      } else if (endDate) {
        // Only endDate is provided
        query = query.where("OrderDate", "<=", endDate);
      }
      query = query.orderBy("ID_Order", sort);

      const orders = await query;
      orders.forEach((order) => {
        order.type = order.ID_Table ? "Dine-In" : "Online";
      });
      res.status(200).render("order-list", {
        customCSS: ["online_user_home.css", "view.css"],
        customJS: ["orders.js"],
        orders,
        customers,
        length: orders.length,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  updateOrder: async (req, res) => {
    const orderId = req.params.orderId;
    try {
      const order = await db("ORDER")
        .select("ID_Order", "ID_Employee")
        .where("ID_Order", orderId)
        .first();

      res.render("update-order", {
        customCSS: ["online_user_home.css", "view.css"],
        cdnCSS:
          '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>',
        order,
        errorMessage: "",
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
  postUpdateOrder: async (req, res, next) => {
    const { employeeId } = req.body;
    const orderId = req.params.orderId;
    try {
      const employee = await db("EMPLOYEE")
        .select("ID_Employee")
        .where("ID_Employee", employeeId)
        .first();
      const order = await db("ORDER")
        .select("ID_Order", "ID_Employee")
        .where("ID_Order", orderId)
        .first();
      if (!employee) {
        return res.status(404).render("update-order", {
          customCSS: ["online_user_home.css", "view.css"],
          cdnCSS:
            '<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>',
          order,
          errorMessage: "Employee not found!",
        });
      }
      await db("ORDER")
        .where("ID_Order", orderId)
        .update({ ID_Employee: employeeId });
      res.status(201).redirect(req.originalUrl);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

export default orderController;
