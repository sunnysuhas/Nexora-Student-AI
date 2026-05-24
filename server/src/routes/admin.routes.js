import { Router } from "express";
import { adminOverview, deleteUser, listUsers } from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireRole("admin"));
router.get("/overview", adminOverview);
router.get("/users", listUsers);
router.delete("/users/:id", deleteUser);

export default router;
