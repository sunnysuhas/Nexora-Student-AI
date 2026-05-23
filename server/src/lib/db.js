import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("MONGODB_URI is not configured. API will start without a database connection.");
    return null;
  }

  return mongoose.connect(uri);
}
