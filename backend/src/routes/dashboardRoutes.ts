import { Router } from 'express';
import { 
    getCurrentPlan, 
    getReceipts, 
    getMyCourses 
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/plan', getCurrentPlan);

router.get('/receipts', getReceipts);

router.get('/courses', getMyCourses);

export default router;