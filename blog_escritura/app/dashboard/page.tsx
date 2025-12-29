import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if(!session) {
        redirect("/login");
    }

    return (
        <main>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-slate-300">
                Sesión activa para: <b>{session.user?.email}</b>
            </p>

            <div className="mt-6">
                <LogoutButton />
            </div>
        </main>
    );
}