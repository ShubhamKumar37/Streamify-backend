import { generateStreamToken } from "../config/stream.config.js";
import { ApiResponse, asyncHandler, ApiError } from "../utils/index.js";

class ChatController {
    getStreamToken = asyncHandler(async (req, res) => {
        const user = req.user;
        const token = generateStreamToken(user._id);
        return res.status(200).json(new ApiResponse(200, "Stream token generated successfully", token));
    });
}

export default new ChatController();


