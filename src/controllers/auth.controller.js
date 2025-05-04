import { asyncHandler } from "../utils/index.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.util.js";
import Otp from "../models/otp.model.js";
import { upsertStreamUser } from "../config/stream.config.js";

class AuthController {
    register = asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) throw new ApiError(400, "User already exists");

        const profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${name}`;
        const user = await User.create({ name, email, password, profileImage });

        // Upserting user in Stream
        try {
            const response = await upsertStreamUser(user);
            console.log("Response from upsertStreamUser :: ", response);
        } catch (error) {
            console.log("Error upserting Stream user:", error);
            throw new ApiError(500, "Internal Server Error");
        }


        return res.status(200).json(new ApiResponse(200, "User created successfully, Now you can login", user));
    });

    login = asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) throw new ApiError(400, "User not found");

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) throw new ApiError(400, "Invalid password");

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            maxAge: 1 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(new ApiResponse(200, "Login successful", { ...user._doc, token }));
    });

    logout = asyncHandler(async (req, res) => {
        res.clearCookie("jwt");
        return res.status(200).json(new ApiResponse(200, "Logout successful"));
    });

    onboard = asyncHandler(async (req, res) => {
        const { bio, location, nativeLanguage, learningLanguage, profileImage } = req.body;

        const user = req.user;
        const updateData = {
            ...(bio && { bio }),
            ...(location && { location }),
            ...(nativeLanguage && { nativeLanguage }),
            ...(learningLanguage && { learningLanguage }),
            ...(profileImage && { profileImage }),
            onBoard: true,
        };

        const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true });
        if (!updatedUser) throw new ApiError(400, "Failed to onboard user");

        
        try {
            const response = await upsertStreamUser(updatedUser);
            console.log("Response from upsertStreamUser :: ", response);
        } catch (error) {
            console.log("Error upserting Stream user:", error);
            throw new ApiError(500, "Internal Server Error");
        }

        return res.status(200).json(new ApiResponse(200, "Onboarded successfully", updatedUser));
    });

    me = asyncHandler(async (req, res) => {
        const user = req.user;
        return res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
    });

    sendOtp = asyncHandler(async (req, res) => {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await Otp.create({ email, otp });
        return res.status(200).json(new ApiResponse(200, "OTP sent successfully", otp));
    });

    changePassword = asyncHandler(async (req, res) => {
        const { email, otp, password } = req.body;
        const otpDoc = await Otp.findOne({ email, otp }).sort({ createdAt: -1 });
        if (!otpDoc) throw new ApiError(400, "Invalid OTP");

        const user = await User.findOne({ email });
        if (!user) throw new ApiError(400, "User not found");

        user.password = password;
        await user.save();

        return res.status(200).json(new ApiResponse(200, "Password changed successfully"));
    });
}

export default new AuthController();