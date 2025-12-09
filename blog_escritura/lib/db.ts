import mongoose from "mongoose";
import { cache } from "react";

Import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("⚠️ MONGODB_URI is not defined in .env.local");
}

// Evitar múltiples conexiones en desarrollo (hot reload de Next)

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null};
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = (await mongoose.connect(MONGODB_URI!)).then((mongoose) => {
            console.log("Connected to MongoDB")
        });
    }
}

cached.conn = await cached.promise;
return cached.conn;