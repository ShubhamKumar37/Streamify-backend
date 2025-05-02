import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import authToken from "../middlewares/authToken.middleware.js";
import validate from "../validator/schemaValidator.js";
import { registerSchema, loginSchema, onboardSchema } from "../validator/auth.validator.js";
const router = Router();
const { register, login, logout, onboard, me } = AuthController;

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/onboard", authToken, validate(onboardSchema), onboard);
router.get("/me", authToken, me);

export default router;
