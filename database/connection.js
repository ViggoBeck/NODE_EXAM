import mongoose from "mongoose";

export default async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'todo-app' 
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Stop the application if connection fails
    }

}