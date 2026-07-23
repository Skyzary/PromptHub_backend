import mongoose from "mongoose";
import { logger } from "./loggers.ts";
const MONGO_URL = process.env.MONGO_URL;

export default async function dbConnect() {
  if (!MONGO_URL) {
    throw new Error("MONGO_URL is not defined");
  }
  await mongoose.connect(MONGO_URL);
  logger.info("MongoDB connected");
}
