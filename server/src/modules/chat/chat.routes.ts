import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/message", authMiddleware, (req: any, res) => {
  res.status(200).json({
    success: true,
    message: "Chat route protected successfully",
    user: req.user,
  });
});

export default router;