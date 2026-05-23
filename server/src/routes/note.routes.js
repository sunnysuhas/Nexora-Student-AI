import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", (_request, response) => response.status(501).json({ message: "List notes placeholder." }));
router.post("/", (_request, response) => response.status(501).json({ message: "Create note placeholder." }));
router.patch("/:id", (_request, response) => response.status(501).json({ message: "Update note placeholder." }));
router.delete("/:id", (_request, response) => response.status(501).json({ message: "Delete note placeholder." }));

export default router;
