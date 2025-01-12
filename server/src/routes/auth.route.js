import express from "express";
import { register, login, socialLogin, logout } from "../controllers/auth.controller.js";
import checkAuthAndRefreshToken from "../middlewares/checkAuthAndRefreshToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/social-login", socialLogin);
router.post("/logout", checkAuthAndRefreshToken, logout);


export default router;