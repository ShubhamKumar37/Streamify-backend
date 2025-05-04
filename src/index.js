import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { ErrorHandler } from './middlewares/index.js';
import { dbConnect } from './config/dbConnect.config.js';
import authRoute from './routes/auth.route.js';
import userRoute from './routes/user.route.js';
import chatRoute from './routes/chat.route.js';
import cors from 'cors';


dotenv.config({ path: '.env' });

const app = express();

dbConnect();


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://chatter-frontend-rouge.vercel.app',
        'https://chatter-frontend-rouge.vercel.app',
        'https://chatter-frontend-git-main-shubham-kumars-projects-c7fe827c.vercel.app',
        'https://chatter-frontend-nyvp0ljxc-shubham-kumars-projects-c7fe827c.vercel.app'
    ],
    credentials: true,
}));
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use(ErrorHandler);

app.get("/", (req, res) => {
    res.send("Hi this is a backend server ");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on this url http://localhost:${process.env.PORT}`);
});
