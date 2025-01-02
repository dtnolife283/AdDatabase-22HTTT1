import express from "express";
import viewEmployeeController from "../controllers/view-employee.js";

const router = express.Router();

router.get('/', viewEmployeeController.getViewEmployeePage);
router.get('/edit/:id', viewEmployeeController.getEditEmployeeInfoPage);
router.post('/edit/:id', viewEmployeeController.postEditEmployeeInfo);

export default router;