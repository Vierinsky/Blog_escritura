import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({ ok: true, message: "Connected to MongoDB"});
    } catch (error) {
        console.error("Error while connecting to MongoDB:", error);
        return NextResponse.json(
            { ok: false, message: "Error while connecting to MongoDB"},
            {status: 500}
        );
    }
}