import mongoose from "mongoose";

const connectDB = async () => {
    try{
        mongoose.connect("mongodb://localhost:27017/backend");
        console.log("MongoDB is connected")
    }catch (error) {
        console.error("MongoDB connect failed ", error.message);
        process.exit(1);
    }
}

export default connectDB;