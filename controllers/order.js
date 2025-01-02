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
};

export default orderController;
