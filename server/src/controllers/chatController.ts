import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

export const sendMessage = (req: AuthRequest, res: Response) => {
    res.json({ message: `${req.user?.username} sent a message` });
};

export const getHistory = (req: AuthRequest, res: Response) => {
    res.json({ message: "Chat history loaded", user: req.user });
};