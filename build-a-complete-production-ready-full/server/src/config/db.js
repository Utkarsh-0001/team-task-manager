import mongoose from "mongoose";
import { getMongoUri } from "./env.js";

export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(getMongoUri(), {
    serverSelectionTimeoutMS: 10000
  });
  console.log("MongoDB connected");
};
