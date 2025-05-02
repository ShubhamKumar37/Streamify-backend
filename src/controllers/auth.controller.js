import { asyncHandler } from "../utils/index.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.util.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.util.js";

class AuthController {
    register = asyncHandler(async (req, res) => {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) throw new ApiError(400, "User already exists");

        const profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${name}`;
        const user = await User.create({ name, email, password, profileImage });

        // Upserting user in Stream
        try {
            const response = await upsertStreamUser({
                id: user._id.toString(),
                name: user.name,
                image: user.profileImage,
                email: user.email,
            });
            console.log("Response from upsertStreamUser :: ", response);
        } catch (error) {
            console.error("Error upserting Stream user:", error);
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

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
        const { name, bio, location, nativeLanguage, learningLanguage } = req.body;

        const user = req.user;
        const updateData = {
            ...(name && { name }),
            ...(bio && { bio }),
            ...(location && { location }),
            ...(nativeLanguage && { nativeLanguage }),
            ...(learningLanguage && { learningLanguage }),
            onBoard: true,
        };

        const updatedUser = await User.findByIdAndUpdate(user._id, updateData, { new: true });
        if (!updatedUser) throw new ApiError(400, "Failed to onboard user");

        // Upserting user in Stream
        try {
            const response = await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.name,
                image: updatedUser.profileImage,
                email: updatedUser.email,
            });
            console.log("Response from upsertStreamUser :: ", response);
        } catch (error) {
            console.error("Error upserting Stream user:", error);
            throw new ApiError(500, "Internal Server Error");
        }

        return res.status(200).json(new ApiResponse(200, "Onboarded successfully", updatedUser));
    });

    me = asyncHandler(async (req, res) => {
        const user = req.user;
        return res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
    });
}

export default new AuthController();