import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { name, email, password, bio } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { ok: false, message: "Faltan campos Obligatorios"},
                { status: 400}
            );
        }

        const existing = await User.findOne({ email });

        if (existing) {
            return NextResponse.json(
                { ok: false, message: "El email ya está registrado" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            bio: bio || "",
        });

        return NextResponse.json(
            {
                ok: true,
                message: "Usuario creado correctamente",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error en registro:", error);
        return NextResponse.json(
            { ok: false, message: "Error interno del servidor"},
            { status: 500 }
        );
    }
}