import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const onboardSchema = Joi.object({
    name: Joi.string().required(),
    bio: Joi.string().required(),
    location: Joi.string().required(),
    nativeLanguage: Joi.string().required(),
    learningLanguage: Joi.string().required(),
});

export { registerSchema, loginSchema, onboardSchema };