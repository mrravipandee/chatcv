import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { sendChatController } from "./chat.controller";

const router = Router();

router.post("/message", authMiddleware, sendChatController);

export default router;