import { Router } from "express";
import authToken from "../middlewares/authToken.middleware.js";
import ChatController from "../controllers/chat.controller.js";

const router = Router();
const { getStreamToken } = ChatController;

router.use(authToken);
router.get("/token", getStreamToken);

export default router; 
