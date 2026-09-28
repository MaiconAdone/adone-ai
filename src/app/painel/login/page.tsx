"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PainelLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/painel/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data.error || "Não foi possível entrar.");
                return;
            }
            router.replace("/painel");
            router.refresh();
        } catch {
            setError("Erro de conexão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center px-4">
            <form onSubmit={submit} className="w-full max-w-sm rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8">
                <div className="w-12 h-12 rounded-full bg-brand-500/15 flex items-center justify-center">
                    <LockIcon className="w-5 h-5 text-brand-700" />
                </div>
                <h1 className="mt-5 text-xl font-semibold text-foreground">Painel de marketing</h1>
                <p className="mt-1 text-sm text-muted-foreground">Acesso restrito à Adone Intelligence.</p>
                <label htmlFor="painel-senha" className="mt-6 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Senha</label>
                <input
                    id="painel-senha"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3 text-sm text-foreground focus:outline-none focus:border-brand-500/50"
                />
                {error && <p role="alert" className="mt-3 text-sm text-red-400 light:text-red-600">{error}</p>}
                <Button type="submit" disabled={loading || !password} className="mt-6 w-full bg-brand-700 hover:bg-brand-600 text-white">
                    {loading ? <Loader2Icon className="w-4 h-4 animate-spin" /> : "Entrar"}
                </Button>
            </form>
        </main>
    );
}
