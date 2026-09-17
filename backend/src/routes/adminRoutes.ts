import { Router } from 'express';
import { 
    createCourse, 
    createLesson, 
    getCourses, 
    getLessons,
    deleteCourse,
    deleteLesson
} from '../controllers/adminController.js';

const router = Router();

router.post('/courses', createCourse);
router.post('/lessons', createLesson);
router.get('/courses', getCourses);
router.get('/lessons', getLessons);
router.delete('/courses/:id', deleteCourse);
router.delete('/lessons/:id', deleteLesson);

export default router;