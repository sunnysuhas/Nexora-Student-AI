import { Router } from "express";

const router = Router();

router.post("/", (request, response) => {
  const { name, email, message } = request.body;

  if (!name || !email || !message) {
    return response.status(400).json({ message: "Name, email, and message are required." });
  }

  return response.status(202).json({
    message: "Contact payload accepted. Connect EmailJS, Formspree, or SMTP in production.",
    to: process.env.CONTACT_TO_EMAIL || "sunnysuhas108@gmail.com",
  });
});

export default router;
