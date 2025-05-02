import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";

class UserController {
    getRecommendedUsers = asyncHandler(async (req, res) => {
        const user = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: user._id } },
                { _id: { $nin: user.friends } },
                { onBoard: true },
            ]
        });

        return res.status(200).json(new ApiResponse(200, "Recommended users fetched successfully", recommendedUsers));
    });

    getMyFriends = asyncHandler(async (req, res) => {
        const user = req.user;
        const friends = await User.findById(user._id).select("friends").populate("friends", "name profileImage learningLanguage nativeLanguage");

        return res.status(200).json(new ApiResponse(200, "Friends fetched successfully", friends));
    });

    sendFriendRequest = asyncHandler(async (req, res) => {
        const user = req.user;
        const sender = user._id;
        const { id: receiver } = req.params;

        if (sender.equals(receiver)) throw new ApiError(400, "You cannot send friend request to yourself");
        
        const receiverExists = await User.findById(receiver);
        if (!receiverExists) throw new ApiError(400, "Receiver not found");
        if(receiverExists.friends.includes(sender)) throw new ApiError(400, "You are already friends with this user");  

        const existingRequest = await FriendRequest.findOne({ sender, receiver });
        if (existingRequest) throw new ApiError(400, "Friend request already sent");

        const friendRequest = await FriendRequest.create({ sender, receiver });

        return res.status(200).json(new ApiResponse(200, "Friend request sent successfully", friendRequest));
    });

    acceptFriendRequest = asyncHandler(async (req, res) => {
        const user = req.user;
        const { id: requestId } = req.params;

        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest) throw new ApiError(400, "Friend request not found");
        if(friendRequest.sender.equals(user._id)) throw new ApiError(400, "You cannot accept your own friend request");

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, { $push: { friends: friendRequest.receiver } });
        await User.findByIdAndUpdate(friendRequest.receiver, { $push: { friends: friendRequest.sender } });

        return res.status(200).json(new ApiResponse(200, "Friend request accepted successfully"));
    });

    getFriendRequests = asyncHandler(async (req, res) => {
        const user = req.user;

        const incomingRequests = await FriendRequest.find({ receiver: user._id }).populate("sender", "name profileImage learningLanguage nativeLanguage");
        const acceptedRequests = await FriendRequest.find({ sender: user._id, status: "accepted" }).populate("receiver", "name profileImage learningLanguage nativeLanguage");

        return res.status(200).json(new ApiResponse(200, "Friend requests fetched successfully", { incomingRequests, acceptedRequests }));
    });

    getOutGoingFriendRequests = asyncHandler(async (req, res) => {
        const user = req.user;

        const outgoingRequests = await FriendRequest.find({ sender: user._id, status: "pending" }).populate("receiver", "name profileImage learningLanguage nativeLanguage");

        return res.status(200).json(new ApiResponse(200, "Outgoing friend requests fetched successfully", outgoingRequests));
    });
}

export default new UserController();
