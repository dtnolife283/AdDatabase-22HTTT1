import express from "express";
import revenueController from "../controllers/revenue.js";

const router = express.Router();

router.get("/", revenueController.getRevenueHomePage);

router.get("/search", revenueController.getRevenuePage);

export default router;