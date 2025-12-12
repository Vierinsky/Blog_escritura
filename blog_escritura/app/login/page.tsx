"use client";

import { useState, ChangeEvent, FormEvent } from "react";

type LoginFormData = {
    email: string;
    password: string;
};

type ApiResponse = 
    | { ok: true; message: string; user: { id: string; name: string; email: string} }
    | { ok: false; message: string };

export default function LoginPage() {
    const [form, setForm] = useState<LoginFormData>({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data: ApiResponse = await res.json();

            if (!data.ok) {
                setError(data.message);
            } else {
                setMessage(data.message);

                // Por ahora solo demostramos que logueó.
                // Más adelante lo cambiaremos por NextAuth.
            }
        } catch (err) {
            setError("Error de red o del servidor");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
      <div className="w-full max-w-md bg-slate-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm" htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-indigo-500 hover:bg-indigo-600 px-4 py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Iniciando..." : "Entrar"}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-green-400">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
    </main>
  );
}