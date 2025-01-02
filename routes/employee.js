import express from 'express';
import moveEmployee from '../controllers/employee.js';

const router = express.Router();

router.get('/transfer', moveEmployee.renderTransferPage);

router.post('/transfer', moveEmployee.moveEmployee);

export default router;