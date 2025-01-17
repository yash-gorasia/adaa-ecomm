import User from "../models/userModel.js"; // Import the User model
import asyncHandler from "../middlewares/asyncHandler.js"; // Import the asyncHandler middleware
import bcrypt from "bcryptjs"; // Import bcrypt
import generateToken from "../utils/createToken.js"; // Import the generateToken function

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body; // Destructure the username, email, and password from req.body

    if (!username || !email || !password) { // If username, email, or password is missing
        res.status(400); // Set the status code to 400
        throw new Error("Please fill in all fields"); // Throw an error
    };

    const userExists = await User.findOne({ email }); // Check if the user already exists
    if (userExists) { // If the user already exists
        res.status(400); // Set the status code to 400
        throw new Error("User already exists"); // Throw an error
    };

    const salt = await bcrypt.genSalt(10); // Generate a salt, it will add random characters to the password
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    const newUser = await User.create({ username, email, password: hashedPassword }); // Create a new user

    try {
        newUser.save(); // Save the new user
        generateToken(res, newUser._id); // Generate a token


        res.status(201).json({ // Send a response
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            isAdmin: newUser.isAdmin
        });
    } catch (error) {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body; // Destructure the email and password from req.body

    const existingUser = await User.findOne({ email }); // Find the user by email

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password); // Compare the password

        if (isPasswordValid) {
            generateToken(res, existingUser._id); // Generate a token

            res.status(200).json({ // Send a response
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin
            });
            return; // we return to stop the function

        }
    }

    res.status(401); // Set the status code to 401
    throw new Error("Invalid email or password"); // Throw an error
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("JWT", "", { // Clear the cookie
        httpOnly: true,
        expires: new Date(0)
    });

    res.status(200).json({ message: "User logged out" }); // Send a response
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}); // Find all users
    res.json(users); // Send a response
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); // Find the user by id
    if (user) {
        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
        })
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id); // Find the user by id

    if (user) {
        user.username = req.body.username || user.username; // Update the username
        user.email = req.body.email || user.email; // Update the email

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10); // Generate a salt, it will add random characters to the password
            const hashedPassword = await bcrypt.hash(req.body.password, salt); // Hash the password
            user.password = hashedPassword; // Update the password
        }


        const updatedUser = await user.save(); // Save the updated user

        res.json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const deleteUserbyId = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // Find the user by id

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("You cannot delete an admin user");
        }

        await User.deleteOne({ _id: user.id }) // Delete the user
        res.json({ message: "User removed" }); // Send a response

    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password') // Find the user by id

    if (user) {
        res.json(user); // Send a response
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id); // Find the user by id

    if (user) {
        user.username = req.body.username || user.username; // Update the username
        user.email = req.body.email || user.email; // Update the email
        user.isAdmin = req.body.isAdmin || user.isAdmin; // Update the isAdmin

        const updatedUser = await user.save(); // Save the updated user

        res.json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }

});

export {
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserbyId,
    getUserById,
    updateUserById
};