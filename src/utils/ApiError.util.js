class ApiError extends Error {
    constructor(statusCode, message = "Some thing is done", errors = [], stack = "") {
        super(message);
        this.success = statusCode < 200;
        this.statusCode = statusCode;
        this.errors = errors;
        if (stack) this.stack = stack;
        else Error.captureStackTrace(this, this.constructor);

    }
}

export { ApiError };