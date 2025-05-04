import Joi from "joi";

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).required(),
});

const onboardSchema = Joi.object({
    bio: Joi.string().required(),
    location: Joi.string().required(),
    nativeLanguage: Joi.string().required(),
    learningLanguage: Joi.string().required(),
    profileImage: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    password: Joi.string().min(4).required(),
});

export { registerSchema, loginSchema, onboardSchema, changePasswordSchema };