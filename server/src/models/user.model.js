import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
    },
    password: {
        type: String,
        minlength: [6, "Password must be at least 6 characters long"],
    },
    profilePic: {
        public_id: String,
        url: String
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);