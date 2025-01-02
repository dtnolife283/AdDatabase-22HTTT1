import orderController from "../controllers/order.js";

import express from "express";

const router = express.Router();

router.get("/", orderController.getOrders);

export default router;
