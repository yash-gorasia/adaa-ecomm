import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/createToken.js';
import User from '../models/userModel.js';

const registerUser = async (req, res) => {
    try {
        const { name, email, password, age, gender, phone_number, address } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            age,
            gender,
            phone_number,
            address,
        });

        // Save the user to the database
        await newUser.save();
        generateToken(res, newUser._id);

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
        throw new Error("Invalid user data");
    }
}

const logingUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = User.findOne({ email });

        if (existingUser) {
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);

            if (isPasswordValid) {
                generateToken(res, existingUser._id);
                res.status(201).json({ message: 'User logged in successfully', user: existingUser });
            }
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
        throw new Error("Invalid email or password");
    }
}

const logoutUser = async (req, res) => {
    try {
        res.cookie('JWT', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
}

export { registerUser, logingUser, logoutUser };
