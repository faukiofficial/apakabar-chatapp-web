import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../lib/generateToken.js";
import { set } from "mongoose";
import setTokenCookies from "../lib/setTokenCookies.js";
import clearCookie from "../lib/clearCookie.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });

    const { token, refreshToken } = generateToken(user._id);

    setTokenCookies(res, token, refreshToken);

    user.password = undefined;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log("Error in register controller:", error);
    res.status(500).json({
      success: false,
      message: "Create user failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const { token, refreshToken } = generateToken(user._id);

    setTokenCookies(res, token, refreshToken);

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

export const socialLogin = async (req, res) => {
  try {
    const { name, email, picture } = req.body;

    const user = User.findOne({ email });

    if (!user) {
      const newUser = await User.create({ name, email, profilePic: { url: picture } });

      const { token, refreshToken } = generateToken(newUser._id);

      setTokenCookies(res, token, refreshToken);

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: newUser,
      });
    } else {
      const { token, refreshToken } = generateToken(user._id);

      setTokenCookies(res, token, refreshToken);

      res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user,
      });
    }
  } catch (error) {
    console.log("Error in social login controller:", error);
    res.status(500).json({
      success: false,
      message: "Social login failed",
    });
  }
};

export const logout = async (req, res) => {
  try {
    clearCookie(res, "token");
    clearCookie(res, "refreshToken");

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.log("Error in logout controller:", error);
    res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
