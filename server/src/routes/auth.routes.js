import { Router } from "express";

const router = Router();

router.post("/register", (_request, response) => {
  response.status(501).json({ message: "Register controller ready to connect to MongoDB." });
});

router.post("/login", (_request, response) => {
  response.status(501).json({ message: "Login controller ready for JWT implementation." });
});

router.post("/forgot-password", (_request, response) => {
  response.status(501).json({ message: "Password reset flow placeholder." });
});

export default router;
