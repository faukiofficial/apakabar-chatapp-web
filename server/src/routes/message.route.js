import express from "express";
import { getUsersForSidebar, getMessages, sendMessage, deleteMessage } from "../controllers/message.controller.js";
import checkAuthAndRefreshToken from "../middlewares/checkAuthAndRefreshToken.js";

const router = express.Router();

router.get("/users-for-sidebar", checkAuthAndRefreshToken, getUsersForSidebar);
router.get("/:id", checkAuthAndRefreshToken, getMessages);
router.post("/", checkAuthAndRefreshToken, sendMessage);
router.delete("/:id", checkAuthAndRefreshToken, deleteMessage);

export default router;