import mongoose from "mongoose";
import { sendEmail } from "../utils/emailHelper.util.js";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 },
});

otpSchema.pre("save", async function (next) {
    try {
        const mailBody = `
        <div>
            <h1>Here is your OTP</h1>
            <p>Your OTP is ${this.otp}. Click the link below to reset your password.</p>
            <a href="${process.env.FRONTEND_URL}/change-password">Reset Password</a>
        </div>
        `
        await sendEmail(this.email, "Here is your OTP", mailBody);
        next();
    } catch (error) {
        next(error);
    }
});


const Otp = mongoose.model("Otp", otpSchema);

export default Otp;

