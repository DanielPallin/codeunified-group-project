import { Router } from 'express';
import { processMockPayment } from '../controllers/paymentController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/checkout', authenticateUser, processMockPayment);

export default router;