import express from "express";
import menuController from "../controllers/menu.js";

const router = express.Router();

router.get("/", menuController.getMenuPage);

export default router;