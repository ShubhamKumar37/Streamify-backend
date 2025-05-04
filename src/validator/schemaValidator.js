import { ApiError } from "../utils/ApiError.util.js";

const schemaValidator = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        throw new ApiError(400, errorMessages);
    }

    next();
};

export default schemaValidator;
