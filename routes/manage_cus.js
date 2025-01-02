import express from "express";
import managerCusController from "../controllers/manage_cus.js";

const router = express.Router();

router.get("/", managerCusController.getAllCus);

router.get("/edit/:id", managerCusController.editCus);

router.post("/update", managerCusController.updateCus);

export default router;