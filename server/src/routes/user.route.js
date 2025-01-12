import express from "express";
import { getAllUsers, getUserInfo, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";
import checkAuthAndRefreshToken from "../middlewares/checkAuthAndRefreshToken.js";
import multer from "multer";

const storage = multer.memoryStorage()
const upload = multer({ storage })

const router = express.Router();

router.get("/all", checkAuthAndRefreshToken, getAllUsers);
router.get("/", checkAuthAndRefreshToken, getUserInfo);
router.get("/:id", checkAuthAndRefreshToken, getUserById);
router.put("/", checkAuthAndRefreshToken, upload.single("profilePic"), updateUser);
router.delete("/", checkAuthAndRefreshToken, deleteUser);

export default router;