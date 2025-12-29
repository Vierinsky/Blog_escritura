"use client"

import { signOut } from "next-auth/react"

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded bg-slate-700 hover:bg-slate-600 px-4 py-2"
        >
            Cerrar sesión
        </button>
    );
}