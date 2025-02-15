import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "my_secret_key";

/**
 * User login controller
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username },
            SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ token, message: "Login successful", user: { id: user._id, email: user.email, username: user.username } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * User registration controller
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Generate JWT
        const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, SECRET_KEY, { expiresIn: "1d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(201).json({ token, message: "User registered successfully", user: { id: user.id, username, email } });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * User logout controller
 */
export const logout = (req: Request, res: Response) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
    res.json({ message: "Logged out successfully" });
};

/**
 * Get Users controller
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) {
            res.status(401).json({ msg: "No token, authorization denied" });
            return;
        }

        const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ msg: "Invalid token" });
    }
}
