import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("✅ MongoDB connected");
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ MongoDB connection error:", error.message);
    } else {
      console.error("❌ MongoDB connection error:", error);
    }
    process.exit(1);
  }
};

export default connectDB;