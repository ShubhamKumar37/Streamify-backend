import {StreamChat} from "stream-chat";
import dotenv from "dotenv";

dotenv.config({ path: '.env' });

const streamChat = StreamChat.getInstance(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_API_SECRET);

export const upsertStreamUser = async (user) => {   
    try{
        if (!process.env.STREAM_CHAT_API_KEY || !process.env.STREAM_CHAT_API_SECRET) {
            throw new Error("Stream Chat API credentials not configured properly");
        }
        
        const newUser = await streamChat.upsertUser({
            id: user._id.toString(),
            name: user.name,
            image: user.profileImage,
            email: user.email,
        });
        
        return newUser;
    }
    catch(error)
    {
        console.log("Error in upsertStreamUser :: ", error);
        throw error;
    }
};

export const generateStreamToken = (userId) => {
    try {
        const userIdString = userId.toString();
        
        const token = streamChat.createToken(userIdString);
        return token;
    } catch (error) {
        console.log("Error generating Stream token :: ", error);
        throw error;
    }
};
