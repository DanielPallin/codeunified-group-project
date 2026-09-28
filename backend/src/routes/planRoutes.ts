import { Router } from "express";
import { getPlans } from "../controllers/planController.js";

const router = Router();

router.get("/", getPlans);

export default router;