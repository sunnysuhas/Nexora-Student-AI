import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);
router.get("/", (_request, response) => response.status(501).json({ message: "List tasks placeholder." }));
router.post("/", (_request, response) => response.status(501).json({ message: "Create task placeholder." }));
router.patch("/:id", (_request, response) => response.status(501).json({ message: "Update task placeholder." }));
router.delete("/:id", (_request, response) => response.status(501).json({ message: "Delete task placeholder." }));

export default router;
