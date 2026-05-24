import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { Task } from "../models/Task.js";
import { Notification } from "../models/Notification.js";
import { resourceController } from "../controllers/resource.controller.js";

const router = Router();
const controller = resourceController(Task);

router.use(requireAuth);
router.get("/", async (request, response, next) => {
  try {
    const overdueTasks = await Task.find({
      userId: request.user.id,
      deadline: { $lt: new Date() },
      status: { $nin: ["Completed", "Overdue"] },
    });
    if (overdueTasks.length) {
      await Task.updateMany({ _id: { $in: overdueTasks.map((task) => task._id) } }, { status: "Overdue" });
      await Promise.all(
        overdueTasks.map((task) =>
          Notification.findOneAndUpdate(
            { userId: request.user.id, type: "Task", title: "Overdue task", body: `${task.title} is overdue.` },
            { userId: request.user.id, type: "Task", priority: "High", title: "Overdue task", body: `${task.title} is overdue.`, read: false },
            { upsert: true, new: true }
          )
        )
      );
    }
    return controller.list(request, response, next);
  } catch (error) {
    return next(error);
  }
});
router.post("/", controller.create);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
