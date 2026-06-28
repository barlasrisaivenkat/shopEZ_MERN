import User from "../models/User.js";
import {
    registerUser,
    loginUser,
} from "../services/authService.js";

export const register = async (req, res) => {
    try {
        const result = await registerUser(req.body);

        res.status(201).json({
            success: true,
            message: "Registration Successful",
            ...result,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await loginUser(email, password);

        res.status(200).json({
            success: true,
            message: "Login Successful",
            ...result,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getProfile = async (req, res) => {

    const user = await User.findById(req.user.userId)
        .select("-password");

    res.status(200).json(user);
};