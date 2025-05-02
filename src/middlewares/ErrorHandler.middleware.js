import { ApiError, ApiResponse } from "../utils/index.js";

const ErrorHandler = (err, req, res, _) => {
    if (err instanceof ApiError || err instanceof Error) {
        return res.status(err.statusCode).json(new ApiResponse(err.statusCode, err.message, err.errors));
    }
}

export { ErrorHandler };