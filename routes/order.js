import orderController from "../controllers/order.js";

import express from "express";

const router = express.Router();

router.get("/", orderController.getOrders);

router.get("/:orderId/update", orderController.updateOrder);

router.post("/:orderId/update", orderController.postUpdateOrder);

export default router;
