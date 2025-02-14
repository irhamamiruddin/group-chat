import express from "express";
import authMiddleware, { AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Protect group creation
router.post("/create", authMiddleware, (req: AuthRequest, res) => {
    res.json({ message: `Group created by ${req.user?.username}` });
});

// ✅ Protect joining groups
router.post("/join", authMiddleware, (req: AuthRequest, res) => {
    res.json({ message: `${req.user?.username} joined a group` });
});

export default router;
