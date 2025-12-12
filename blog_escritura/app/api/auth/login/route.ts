import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcrypt";

// Asegura runtime Node (por si tu proyecto quedó configurado a Edge)
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const password = typeof body?.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, message: "Faltan email o contraseña" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).exec();

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    if (typeof user.password !== "string" || !user.password) {
      // Esto no debería pasar, pero si pasa explica un 500
      throw new Error("El usuario no tiene password almacenada (user.password vacío)");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json(
        { ok: false, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Login correcto",
      user: { id: String(user._id), name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Error en login:", error);

    // En desarrollo, devuelve el mensaje real para debug (no lo harías así en prod)
    const debugMessage =
      process.env.NODE_ENV === "development"
        ? (error instanceof Error ? error.message : "Error desconocido")
        : "Error interno del servidor";

    return NextResponse.json(
      { ok: false, message: debugMessage },
      { status: 500 }
    );
  }
}


// OLD VERSION:

// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/user";
// import bcrypt from "bcrypt";
// import { DEFAULT_SERIF_FONT } from "next/dist/shared/lib/constants";

// export async function POST(req:NextRequest) {
//     try {
//         await connectDB();

//         const body = await req.json();
//         const { email, password } = body;

//         if (!email || !password) {
//             return NextResponse.json(
//                 { ok: false, message: "Faltan email o contraseña" },
//                 { status: 400 }
//             );
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return NextResponse.json(
//                 { ok: false, message: "Credenciales inválidas" },
//                 { status : 401 }
//             );
//         }

//         const match = await bcrypt.compare(password, user.password);

//         if (!match) {
//             return NextResponse.json(
//                 { ok: false, message: "Credenciales inválidas" },
//                 { status: 401 }
//             );
//         }

//         // Por ahora NO devolvemos JWT ni sesión real. Solo confirmamos.
//         return NextResponse.json({
//             ok: true,
//             message: "Login correcto",
//             user: { id: user._id.toString(), name: user.name, email: user.email },
//         });
//     } catch (error) {
//         console.error("Error en login:", error);
//         return NextResponse.json(
//             { ok: false, message: "Error interno del servidor" },
//             { status: 500}
//         );
//     }
// }
