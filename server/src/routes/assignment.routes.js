import { Router } from "express";
import { resourceController } from "../controllers/resource.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { Assignment } from "../models/Assignment.js";
import { Notification } from "../models/Notification.js";

const router = Router();
const controller = resourceController(Assignment);

router.use(requireAuth);
router.get("/", async (request, response, next) => {
  try {
    const overdueAssignments = await Assignment.find({
      userId: request.user.id,
      dueDate: { $lt: new Date() },
      status: { $nin: ["Completed", "Overdue"] },
    });
    if (overdueAssignments.length) {
      await Assignment.updateMany({ _id: { $in: overdueAssignments.map((assignment) => assignment._id) } }, { status: "Overdue" });
      await Promise.all(
        overdueAssignments.map((assignment) =>
          Notification.findOneAndUpdate(
            { userId: request.user.id, type: "Assignment", title: "Overdue assignment", body: `${assignment.title} is overdue.` },
            {
              userId: request.user.id,
              type: "Assignment",
              priority: "High",
              title: "Overdue assignment",
              body: `${assignment.title} is overdue.`,
              read: false,
            },
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
