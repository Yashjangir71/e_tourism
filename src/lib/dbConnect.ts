import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void>{
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
        
    }

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI not set");
        }
        const db = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
        connection.isConnected = db.connections[0].readyState;
        console.log("db connected successfully");
    } catch (error:any) {
        console.log("db connection failed", error);
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

export default dbConnect;