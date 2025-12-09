import mongoose, {Mongoose} from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in .env.local");
}

/*
  Esto define una variable global para evitar múltiples conexiones
  durante el hot-reload de Next.js (solo en desarrollo).
*/
declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var _mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null };
}

let cached = global._mongoose;

if (!cached) {
    cached = global._mongoose = { conn: null, promise: null};
}

export async function connectDB(): Promise<Mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise =  mongoose.connect(MONGODB_URI!).then((m) => m);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}