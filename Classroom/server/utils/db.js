import mongoose from "mongoose";
import { initGridFS } from "./gridfs.js";
import dotenv from "dotenv";

dotenv.config();

const DBcon = async () => {
  try {
   //  console.log("Connecting to MongoDB with URI:", process.env.MONGODB_URL);
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB Connected");
    initGridFS();
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default DBcon;