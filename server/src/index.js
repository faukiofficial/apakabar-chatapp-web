import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./lib/database.js";

dotenv.config();
connectDB();

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import messageRouter from "./routes/message.route.js";

const app = express();

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

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});