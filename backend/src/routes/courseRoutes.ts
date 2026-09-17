import { Router } from "express";
import { getCourses, getCourseBySlug } from "../controllers/courseController.js";
import { getLessonsByCourse } from "../controllers/lessonController.js";

const router = Router();

router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);
router.get("/:slug/lessons", getLessonsByCourse);

export default router;