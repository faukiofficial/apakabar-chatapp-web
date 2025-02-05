import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        transports: ["websocket", "polling"],
    }
});

const userSockerMap = {};

export function getReceiverSocketId(userId) {
    return userSockerMap[userId];
}


io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);
    console.log("Query params:", socket.handshake.query);

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