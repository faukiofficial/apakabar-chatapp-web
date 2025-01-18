import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "https://apakabar.vercel.app",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }
});

export function getReceiverSocketId(userId) {
    return userSockerMap[userId];
}

const userSockerMap = {};

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSockerMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSockerMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
        delete userSockerMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSockerMap));
    });
});

export { io, server, app };