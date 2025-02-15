import express from "express";
import { createGroup, joinGroup } from "../controllers/groupController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

// ✅ Protect group creation
router.post("/create", authMiddleware, createGroup);

// ✅ Protect joining groups
router.post("/join", authMiddleware, joinGroup);

export default router;
