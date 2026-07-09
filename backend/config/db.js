import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      "mongodb://127.0.0.1:27017/backend";
    const dbName = process.env.MONGO_DB_NAME || "backend";

    await mongoose.connect(mongoUri, { dbName });
    console.log("MongoDB is connected");
  } catch (error) {
    console.error("MongoDB connect failed", error.message);
    process.exit(1);
  }
};

export default connectDB;
