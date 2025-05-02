import mongoose from "mongoose";

const dbConnect = async () => {
    await mongoose.connect(process.env.MONGO_URL)
        .then(() => console.log("Connected to DB"))
        .catch((e) => {
            console.log(e);
            process.exit(1);
        });
};

export { dbConnect };