import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import {
    hashPassword,
    comparePassword,
} from "../utils/hashPassword.js";

export const registerUser = async (userData) => {
    const { name, email, password } = userData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    const token = generateToken(user._id, user.role);

    return { user, token };
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid Email");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid Password");
    }

    const token = generateToken(user._id, user.role);

    return { user, token };
};