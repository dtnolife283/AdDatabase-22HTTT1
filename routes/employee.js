import express from 'express';
import moveEmployee from '../controllers/employee.js';

const router = express.Router();

router.get('/', moveEmployee.renderTransferPage);

router.post('/', moveEmployee.moveEmployee);

export default router;