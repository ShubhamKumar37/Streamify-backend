class ApiResponse {
    constructor(statusCode, message = "Some thing is done", data = null) {
        this.success = statusCode < 200;
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
    }
}

export { ApiResponse };