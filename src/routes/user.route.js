import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import authToken from "../middlewares/authToken.middleware.js";

const router = Router();
const { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutGoingFriendRequests } = UserController;


router.use(authToken);
router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("/friend-request/:id", sendFriendRequest);
router.post("/friend-request/:id/accept", acceptFriendRequest);
router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutGoingFriendRequests);

export default router;
