import { Router } from "express";
import {
  getLessonBySlug,
  getLessonsByCourse,
} from "../controllers/lessonController.js";

import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/:courseSlug", authenticateUser, getLessonsByCourse);

router.get(
  "/:courseSlug/:lessonSlug",
  authenticateUser,
  getLessonBySlug,
);

export default router;
