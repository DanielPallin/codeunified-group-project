import { Router } from 'express';
import { 
    getCurrentPlan, 
    getReceipts, 
    getMyCourses 
} from '../controllers/dashboardController.js';

import { authenticateUser } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/plan', authenticateUser,getCurrentPlan);

router.get('/receipts', authenticateUser,getReceipts);

router.get('/courses', authenticateUser, getMyCourses);

export default router;