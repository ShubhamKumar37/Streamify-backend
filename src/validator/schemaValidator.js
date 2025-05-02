import { ApiError } from "../utils/ApiError.util.js";

const schemaValidator = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        throw new ApiError(400, error.message);
    }
    next();
};

export default schemaValidator;
