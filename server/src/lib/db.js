import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const connection = await mongoose.connect(uri);
  console.log("✅ MongoDB Connected");
  return connection;
}
