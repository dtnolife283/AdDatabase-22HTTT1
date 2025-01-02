import express from "express";
import onlineOrderController from "../controllers/online-order.js";
import inRestaurantController from "../controllers/in-restaurant.js";

const router = express.Router();

router.get("/", onlineOrderController.getOrderPage);

router.get("/area/:areaId", onlineOrderController.getAreaPage);

router.get("/branch/:branchId", inRestaurantController.getBranchPage);

router.post("/place-order", inRestaurantController.postOrder);

router.get("/review/:orderId", onlineOrderController.getReviewPage);

router.post("/review/:orderId", onlineOrderController.postReviewPage);

export default router;
