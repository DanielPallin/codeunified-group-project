import { Router } from "express";
import {
  getCourses,
  getCourseBySlug,
} from "../controllers/courseController.js";
import { getLessonBySlug, getLessonsByCourse } from "../controllers/lessonController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getCourses);
router.get("/:slug", authenticateUser, getCourseBySlug);
router.get("/:slug/lessons", authenticateUser, getLessonsByCourse);
router.get("/:courseSlug/lessons/:lessonSlug", authenticateUser, getLessonBySlug);

export default router;