import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { deleteImage, uploadImage } from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socketio.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select(
      "name profilePic.url email"
    );
    res
      .status(200)
      .json({ success: true, message: "Users fetched successfully", users });
  } catch (error) {
    console.log("Error in getUserForSidebar controller:", error);
    res.status(500).json({ success: false, message: "Failed to get users" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.id;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    })
      .populate("sender", "name profilePic.url")
      .populate("receiver", "name profilePic.url");

    res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.log("Error in getMessages controller:", error);
    res.status(500).json({ success: false, message: "Failed to get messages" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const receiverId = req.params.id;

    let imageData;
    if (req.file) {
      const imageBuffer = req.file.buffer.toString("base64");
      const data = `data:image/jpeg;base64,${imageBuffer}`;
      const result = await uploadImage(data, "apakabar/messages");

      imageData = { url: result.secure_url, public_id: result.public_id };
    }

    const result = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
      image: imageData,
    })

    const newMessage = await Message.findById(result._id)
      .populate("sender", "name profilePic.url")
      .populate("receiver", "name profilePic.url");

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json({
      success: true,
      message: "Message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.log("Error in sendMessage controller:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const receiverId = req.params.id;
    const { text, messageId } = req.body;

    const messageToUpdate = await Message.findById(messageId);

    let imageData;

    if (req.file) {
      if (messageToUpdate.image.public_id) {
        await deleteImage(messageToUpdate.image.public_id);
      }

      const image = req.file.buffer.toString("base64");
      const data = `data:image/jpeg;base64,${image}`;
      const result = await uploadImage(data, "apakabar/messages");

      imageData = { url: result.secure_url, public_id: result.public_id };
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { text: text, image: imageData, isUpdated: true },
      { new: true, runValidators: true }
    )
      .populate("sender", "name profilePic.url")
      .populate("receiver", "name profilePic.url");

      const receiverSocketId = getReceiverSocketId(receiverId);
      console.log("receiverSocketId atas", receiverSocketId);

      if (receiverSocketId) {
        console.log("receiverSocketId", receiverSocketId);
        io.to(receiverSocketId).emit("updatedMessage", updatedMessage);
      }

    res.status(200).json({
      success: true,
      message: "Message updated successfully",
      updatedMessage,
    });
  } catch (error) {
    console.log("Error in updateMessage controller:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update message" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const receiverId = req.params.receiverId;

    console.log("receiverId", receiverId);

    const message = await Message.findById(messageId);

    if (message.image.public_id) {
      await deleteImage(message.image.public_id);
    }

    const deletedMessage =await Message.findByIdAndDelete(messageId);

    const receiverSocketId = getReceiverSocketId(receiverId);

    console.log("receiverSocketId", receiverSocketId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("deletedMessage", deletedMessage);
    }

    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage controller:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete message" });
  }
};
