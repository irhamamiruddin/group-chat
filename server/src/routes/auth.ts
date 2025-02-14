import express, { Response } from "express";
import { check, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "my_secret_key";

const setCookie = (response: Response, cookie_name: string, value: any) => {
    return response.cookie(cookie_name, value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Only secure in production
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
}

// **Register User**
router.post(
    "/register",
    [
        check("username", "Username is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    async (req: any, res: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { username, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ msg: "User already exists" });

            user = new User({ username, email, password });
            await user.save();

            // Generate JWT
            const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, SECRET_KEY, { expiresIn: "1d" });

            // Set HTTP-only cookie
            setCookie(res, "token", token)

            res.json({ token, user: { id: user.id, username, email } });
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
);

// **Login User**
router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    async (req: any, res: any) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: "Invalid credentials" });

            const isMatch = await user.comparePassword(password);
            if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

            // Generate JWT
            const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, SECRET_KEY, { expiresIn: "1d" });

            // Set HTTP-only cookie
            setCookie(res, "token", token)

            res.json({ token, user: { id: user.id, username: user.username, email } });
        } catch (error) {
            res.status(500).send("Server Error");
        }
    }
);

// **Logout User**
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

// **Get User (Protected Route)**
router.get("/me", async (req: any, res: any) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

        const decoded = jwt.verify(token, SECRET_KEY) as { id: string };
        const user = await User.findById(decoded.id).select("-password");

        if (!user) return res.status(404).json({ msg: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(401).json({ msg: "Invalid token" });
    }
});

export default router;