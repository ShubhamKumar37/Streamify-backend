import {StreamChat} from "stream-chat";

const streamChat = StreamChat.getInstance(process.env.STREAM_CHAT_API_KEY, process.env.STREAM_CHAT_API_SECRET);

export const upsertStreamUser = async (user) => {   
    try{
        await streamChat.upsertUser([user]);
        return user;
    }
    catch(error)
    {
        console.error("Error in upsertStreamUser :: ", error);
        throw error;
    }
};

export const generateStreamToken = (userId) => {
    try {
        const userIdString = userId.toString();
        const token = streamChat.createToken(userIdString);
        return token;
    } catch (error) {
        console.error("Error generating Stream token :: ", error);
        throw error;
    }
};

