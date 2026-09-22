import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import {
  authenticateToken,
  type AuthRequest,
} from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authenticateToken, (req: AuthRequest, res) => {
  return res.status(200).json({
    message: "Authenticated",
    user: req.user,
  });
});

export default router;
