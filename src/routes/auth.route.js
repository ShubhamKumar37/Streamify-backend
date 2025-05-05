import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import authToken from "../middlewares/authToken.middleware.js";
import validate from "../validator/schemaValidator.js";
import { registerSchema, loginSchema, onboardSchema, changePasswordSchema } from "../validator/auth.validator.js";
const router = Router();
const { register, login, logout, onboard, me, sendOtp, changePassword } = AuthController;

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", authToken, logout);
router.post("/onboard", authToken, validate(onboardSchema), onboard);
router.put("/me", authToken, me);
router.post("/send-otp", sendOtp);
router.post("/change-password", validate(changePasswordSchema), changePassword);

export default router;
