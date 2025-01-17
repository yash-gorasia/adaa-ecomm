import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    gender: { type: String },
    phone_number: { type: Number },
    address: { type: String },
    profileCompleted: { type: Boolean, default: false },
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;