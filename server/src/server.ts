import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth";
import { connectDB } from "./services/db";
import { initSocket } from "./services/socket";
import cookieParser from "cookie-parser";
import chalk from "chalk";

dotenv.config();

// Environment variables
const PORT = process.env.PORT || 3000;
const HOST = `${process.env.HOST}:${PORT}` || `http://localhost:${PORT}`
const MODE = process.env.MODE || "development";
const STATIC_FILES_PATH = process.env.STATIC_FILES_PATH || "dist";
const MONGO_URI = process.env.MONGO_URI;
const ALLOWED_ORIGINS = process.env.CORS_WHITELIST?.split(',') || []

connectDB(MONGO_URI);
const app = express();
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || ALLOWED_ORIGINS.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true, // Allows cookies to be sent
    })
);

app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } })

app.use("/api/auth", authRoutes);

// Health check route
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: "UP",
        timestamp: new Date().toISOString(),
    });
});


initSocket(io);

server.listen(PORT, () => {
    console.log(chalk.cyan(`Mode ➡  ${chalk.magenta(MODE)}`));
    console.log(chalk.cyan(`Port ➡  ${chalk.magenta(PORT)}`));
    console.log(chalk.cyan(`Server host ➡  ${chalk.magenta(HOST)}`));
    console.log(chalk.cyan(`Cors Allowed Origins ➡ ${chalk.magenta(ALLOWED_ORIGINS)}`));
});