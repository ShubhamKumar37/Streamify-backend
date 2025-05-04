import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.util.js";
import { generateStreamToken } from "../config/stream.config.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";

const authToken = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) throw new ApiError(401, "Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) throw new ApiError(401, "Unauthorized");
 
    const user = await User.findById(decoded._id).select("-password");
    if (!user) throw new ApiError(401, "Unauthorized");

    const streamToken = generateStreamToken(decoded._id);
    if (!streamToken) throw new ApiError(401, "Unauthorized");

    req.user = user;
    req.streamToken = streamToken;
    next();
});

export default authToken;

