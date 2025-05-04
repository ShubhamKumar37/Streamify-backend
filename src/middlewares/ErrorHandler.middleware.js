import { ApiError, ApiResponse } from "../utils/index.js";

const ErrorHandler = (err, req, res, _) => {
    const statusCode = err instanceof ApiError && err.statusCode ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    const errors = err.errors || null;

    return res.status(statusCode).json(new ApiResponse(statusCode, message, errors));
}

export { ErrorHandler };