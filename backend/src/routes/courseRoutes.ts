import { Router } from "express";
import {
  getCourses,
  getCourseBySlug,
} from "../controllers/courseController.js";
import {
  getLessonBySlug,
  getLessonsByCourse,
} from "../controllers/lessonController.js";
import { getQuizByCourseSlug, submitQuiz } from "../controllers/quizController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getCourses);
router.get("/:slug", authenticateUser, getCourseBySlug);
router.get("/:slug/lessons", authenticateUser, getLessonsByCourse);
router.get(
  "/:courseSlug/lessons/:lessonSlug",
  authenticateUser,
  getLessonBySlug,
);
router.get("/:courseSlug/quiz", authenticateUser, getQuizByCourseSlug);
router.post("/:courseSlug/quiz/submit", authenticateUser, submitQuiz);

export default router;
