import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export interface AuthRequest extends Request {
    user?: { id: string; email: string; username: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies?.token;
    const SECRET_KEY = process.env.JWT_SECRET || "my_secret_key";

    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY!) as { id: string; email: string; username: string };
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid token." });
    }
}

export default authMiddleware;