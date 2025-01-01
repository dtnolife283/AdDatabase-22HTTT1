import express from "express";
import viewController from "../controllers/view.js";

const router = express.Router();

router.get("/", viewController.getBranchesPage);

export default router;
