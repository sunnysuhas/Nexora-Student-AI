import { Router } from "express";
import multer from "multer";
import { requireAuth } from "../middleware/auth.js";
import { Note } from "../models/Note.js";
import { resourceController } from "../controllers/resource.controller.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();
const controller = resourceController(Note);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024 } });

router.use(requireAuth);
router.get("/", controller.list);
router.post("/", controller.create);
router.post("/:id/images", upload.single("image"), async (request, response, next) => {
  try {
    if (!request.file) return response.status(400).json({ message: "Image file required" });
    if (!process.env.CLOUDINARY_CLOUD_NAME) return response.status(503).json({ message: "Cloudinary is not configured" });
    const note = await Note.findOne({ _id: request.params.id, userId: request.user.id });
    if (!note) return response.status(404).json({ message: "Note not found" });
    const dataUri = `data:${request.file.mimetype};base64,${request.file.buffer.toString("base64")}`;
    const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: "nexora/notes", resource_type: "image" });
    note.images = [...note.images, uploadResult.secure_url];
    await note.save();
    return response.json({ item: note, imageUrl: uploadResult.secure_url });
  } catch (error) {
    return next(error);
  }
});
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

export default router;
