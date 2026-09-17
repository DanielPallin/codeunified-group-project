import { Router } from 'express';
import { createCourse, createLesson } from '../controllers/adminController.js';

const router = Router();

router.post('/courses', createCourse);

router.post('/lessons', createLesson);

export default router;