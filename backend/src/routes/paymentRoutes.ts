import { Router } from 'express';
import { processMockPayment } from '../controllers/paymentController.js';

const router = Router();

router.post('/checkout', processMockPayment);

export default router;