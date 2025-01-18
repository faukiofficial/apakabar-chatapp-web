import express from "express";
import { getUsersForSidebar, getMessages, sendMessage, updateMessage, deleteMessage } from "../controllers/message.controller.js";
import checkAuthAndRefreshToken from "../middlewares/checkAuthAndRefreshToken.js";
import multer from "multer";

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router();

router.get("/users-for-sidebar", checkAuthAndRefreshToken, getUsersForSidebar);
router.get("/:id", checkAuthAndRefreshToken, getMessages);
router.post("/:id", checkAuthAndRefreshToken, upload.single("image"), sendMessage);
router.put("/:id", checkAuthAndRefreshToken, upload.single("image"), updateMessage);
router.delete("/:receiverId/:messageId", checkAuthAndRefreshToken, deleteMessage);

export default router;