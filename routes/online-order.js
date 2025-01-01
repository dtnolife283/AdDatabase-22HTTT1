import express from "express";
import onlineOrderController from "../controllers/online-order.js";

const router = express.Router();

router.get("/", onlineOrderController.getOrderPage);

router.get("/area/:areaId", onlineOrderController.getAreaPage);

router.get("/branch/:branchId", onlineOrderController.getBranchPage);

router.post("/place-order", onlineOrderController.postOrder);

router.get("/review/:orderId", onlineOrderController.getReviewPage);

router.post("/review/:orderId", onlineOrderController.postReviewPage);

export default router;
