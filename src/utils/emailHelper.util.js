import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: '.env' });

export const sendEmail = async (to, subject, text) => {
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER || !process.env.MAIL_PASS) {
        throw new Error("Missing required environment variables for email configuration");
    }

    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: `Chatter <noreply@chatter.com>`,
        to,
        subject,
        html: text,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        return response;
    } catch (error) {
        console.log("Error sending email:", error);
        throw error;
    }
};
