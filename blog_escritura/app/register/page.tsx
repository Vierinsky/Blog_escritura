"use client";

import { useState, ChangeEvent, FormEvent } from "react";

type RegisterFormData = {
    name: string;
    email: string;
    password: string;
    bio: string;
};

type ApiResponse =
    | { ok: true; message: string; user: { id: string; name: string; email: string } }
    | { ok: false; message: string };

export default function RegisterPage() {
    const [form, setForm] = useState<RegisterFormData>({
        name: "",
        email: "",
        password: "",
        bio: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    function handleChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = event.target;

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
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data: ApiResponse = await res.json();

            if (!data.ok) {
                setError(data.message);
            } else {
                setMessage(data.message);
                // Opcional: limpiar formulario
                setForm({
                    name: "",
                    email: "",
                    password: "",
                    bio: "",
                });
            }
        } catch (err) {
            setError("Error de red o del servidor");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h.screen flex items-center justify-center bg-slate-900 text-slate-100">
            <div className="w-full max-wmd bg-slate-800 rounded-lg shadown-lg p-6">
                <h1 className="text-2x1 font-semibold mb-4">Crear cuenta</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block md-1 text-sm" htmlFor="name">
                            Nombre
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            className="w-full round border-slate-600 bg-slate-900 px-3 py-2"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

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
                        <label className="block mb-1 text.sm" htmlFor="password">
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

                    <div>
                        <label>
                            Bio (Opcional)
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
                            value={form.bio}
                            onChange={handleChange}
                            rows={3}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded bg-indigo-500 hover:bg-indigo-600 px-4 py-2 font-medium disabled:opacity-60"
                    >
                        {loading ? "Creando cuenta..." : "Registrarme"}
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-sm text-green-400">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="mt-4 text-sm text-red-400">
                        {error}
                    </p>
                )}
            </div>
        </main>
    );

}