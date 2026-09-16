import { Router } from "express";
import { getCourses, getCourseBySlug } from "../controllers/courseController.js";

const router = Router();

router.get("/", getCourses);
router.get("/:slug", getCourseBySlug);
export default router;