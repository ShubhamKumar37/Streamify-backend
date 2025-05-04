import mongoose from "mongoose";
import { sendEmail } from "../utils/emailHelper.util.js";

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 },
});

otpSchema.pre("save", async function (next) {
    try {
        await sendEmail(this.email, "Here is your OTP", this.otp);
        next();
    } catch (error) {
        next(error);
    }
});


const Otp = mongoose.model("Otp", otpSchema);

export default Otp;

