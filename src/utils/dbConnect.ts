import mongoose from "mongoose";
const MONGO_URL = process.env.MONGO_URL;
export default async function dbConnect() {
  if (!MONGO_URL) {
    throw new Error("MONGO_URL is not defined");
  }
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
  return;
}
