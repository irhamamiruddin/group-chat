import express from "express";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Change `req: Request` to `req: AuthRequest`
router.get("/protected", authMiddleware, (req: AuthRequest, res) => {
    res.json({ message: "You have access!", user: req.user });
});

// ✅ Protect sending messages
router.post("/send", authMiddleware, (req: AuthRequest, res) => {
    res.json({ message: `${req.user?.username} sent a message` });
});

// ✅ Get protected chat history
router.get("/history", authMiddleware, (req: AuthRequest, res) => {
    res.json({ message: "Chat history loaded", user: req.user });
});


export default router;
