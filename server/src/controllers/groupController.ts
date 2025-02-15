import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

export const createGroup = (req: AuthRequest, res: Response) => {
    res.json({ message: `Group created by ${req.user?.username}` });
};

export const joinGroup = (req: AuthRequest, res: Response) => {
    res.json({ message: `${req.user?.username} joined a group` });
};