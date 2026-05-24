import { asyncHandler } from "../utils/asyncHandler.js";

export function resourceController(Model) {
  return {
    list: asyncHandler(async (request, response) => {
      const items = await Model.find({ userId: request.user.id }).sort({ createdAt: -1 });
      response.json({ items });
    }),
    create: asyncHandler(async (request, response) => {
      const item = await Model.create({ ...request.body, userId: request.user.id });
      response.status(201).json({ item });
    }),
    update: asyncHandler(async (request, response) => {
      const item = await Model.findOneAndUpdate({ _id: request.params.id, userId: request.user.id }, request.body, { new: true });
      if (!item) return response.status(404).json({ message: "Not found" });
      response.json({ item });
    }),
    remove: asyncHandler(async (request, response) => {
      const item = await Model.findOneAndDelete({ _id: request.params.id, userId: request.user.id });
      if (!item) return response.status(404).json({ message: "Not found" });
      response.status(204).send();
    }),
  };
}
