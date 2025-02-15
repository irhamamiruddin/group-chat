import express from "express";
import { getHistory, sendMessage } from "../controllers/chatController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @openapi
 * /api/chat/send:
 *   post:
 *     tags:
 *       - Message
 *     summary: Send a message
 *     description: Send a message
 */
router.post("/send", authMiddleware, sendMessage);


/**
 * @openapi
 * /api/chat/history:
 *   post:
 *     tags:
 *       - Message
 *     summary: Send a message
 *     description: Send a message
 */
router.get("/history", authMiddleware, getHistory);


export default router;
