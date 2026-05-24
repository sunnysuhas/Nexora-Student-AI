import { Router } from "express";
import { chat, listChats } from "../controllers/ai.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/chats", listChats);
router.post("/chat", chat);

export default router;
