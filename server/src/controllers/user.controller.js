import clearCookie from "../lib/clearCookie.js";
import { deleteImage, uploadImage } from "../lib/cloudinary.js";
import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
  try {
    const { query, limit, skip } = req.query;

    if (query) {
      const users = await User.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      })
        .limit(limit)
        .skip(skip)
        .select("-password -profilePic.public_id");
      return res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        users,
      });
    }

    const users = await User.find().select("-password -profilePic.public_id");
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    console.log("Error in getAllUsers controller:", error);
    res.status(500).json({ success: false, message: "Failed to get users" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password -profilePic.public_id");
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log("Error in getUser controller:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get user info" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -profilePic.public_id");
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log("Error in getUserById controller:", error);
    res.status(500).json({ success: false, message: "Failed to get user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (req.file) {
      if (req.user.profilePic?.public_id) {
        await deleteImage(req.user.profilePic.public_id);
      }

      const fileBuffer = req.file.buffer.toString("base64");
      const imageData = `data:image/jpeg;base64,${fileBuffer}`;
      const result = await uploadImage(imageData, "apakabar/profilePic");

      const userData = { name, email, profilePic: { public_id: result.public_id, url: result.secure_url } };

      const user = await User.findByIdAndUpdate(req.user._id, userData, {
        new: true,
        runValidators: true,
      }).select("-password -profilePic.public_id");

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
      });
    } else {
      const userData = { name, email };

      const user = await User.findByIdAndUpdate(req.user._id, userData, {
        new: true,
        runValidators: true,
      }).select("-password -profilePic.public_id");

      res.status(200).json({
        success: true,
        message: "User updated successfully",
        user,
      });
    }
  } catch (error) {
    console.log("Error in updateUser controller:", error);
    res.status(500).json({ success: false, message: "Update profile failed" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    clearCookie(res, "token");
    clearCookie(res, "refreshToken");

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user,
    });
  } catch (error) {
    console.log("Error in deleteUser controller:", error);
    res.status(500).json({ success: false, message: "Delete account failed" });
  }
};
