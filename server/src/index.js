import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import connectDB from "./lib/database.js";

dotenv.config();
connectDB();

const __dirname = path.resolve();

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./api/socketio.js";

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));


app.get("/", (req, res) => {
    res.send("Server is running");
});

const API_V1 = "/api/v1";

app.use(`${API_V1}/auth`, authRouter);
app.use(`${API_V1}/user`, userRouter);
app.use(`${API_V1}/message`, messageRouter);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
    });
}

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});