import { Router } from "express";
import {
  getCourses,
  getCourseBySlug,
} from "../controllers/courseController.js";
import { getLessonBySlug, getLessonsByCourse } from "../controllers/lessonController.js";

const router = Router();

router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);
router.get("/:slug/lessons", getLessonsByCourse);
router.get("/:courseSlug/lessons/:lessonSlug", getLessonBySlug);

export default router;
