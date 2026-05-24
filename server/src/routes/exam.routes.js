import { Router } from "express";
import { resourceController } from "../controllers/resource.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { Exam } from "../models/Exam.js";

const router = Router();
const controller = resourceController(Exam);

router.use(requireAuth);
router.get("/", controller.list);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
