import express from "express";
import managerCusController from "../controllers/manage_cus.js";

const router = express.Router();

router.get("/", managerCusController.getAllCus);

router.get("/edit/:id", managerCusController.editCus);

router.post("/update", managerCusController.confirmUpdate);

router.post("/delete", managerCusController.confirmDeletion);

router.get("/add", managerCusController.addCus);

export default router;