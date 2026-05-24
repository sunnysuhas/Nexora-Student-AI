import { Router } from "express";
import { resourceController } from "../controllers/resource.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { Notification } from "../models/Notification.js";

const router = Router();
const controller = resourceController(Notification);

router.use(requireAuth);
router.get("/", controller.list);
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
