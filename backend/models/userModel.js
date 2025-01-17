import mongoose from "mongoose"; // Import mongoose

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }


},
    { timestamps: true }
); // Create a new mongoose schema

const User = mongoose.model("User", userSchema); // Create a new mongoose model

export default User; // Export the model