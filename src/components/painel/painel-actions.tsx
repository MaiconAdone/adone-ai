"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, LogOutIcon, MessageCircleIcon, PlayIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";

export function RunAgentButton({ agent, running }: { agent: string; running: boolean }) {
    const router = useRouter();
    const [busy, setBusy] = useState(running);
    const [message, setMessage] = useState<string | null>(null);

    const run = async () => {
        setBusy(true);
        setMessage("Rodando… pode levar alguns minutos.");
        try {
            const res = await fetch("/api/painel/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ agent }),
            });
            const data = await res.json().catch(() => ({}));
            setMessage(res.ok ? `✓ ${data.summary}` : `✗ ${data.summary || data.error || "Falhou"}`);
            router.refresh();
        } catch {
            setMessage("✗ Erro de conexão");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div>
            <Button size="sm" variant="outline" onClick={run} disabled={busy}>
                {busy ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <PlayIcon className="w-4 h-4 mr-2" />}
                {busy ? "Rodando" : "Rodar agora"}
            </Button>
            {message && <p className="mt-2 text-xs text-muted-foreground">{message}</p>}
        </div>
    );
}

export function ContactLeadButton({ row }: { row: string }) {
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const contact = async () => {
        if (!confirm("A Vick vai mandar a primeira mensagem para esse lead no WhatsApp. Continuar?")) return;
        setBusy(true);
        try {
            const res = await fetch("/api/painel/contact-lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ row }),
            });
            const data = await res.json().catch(() => ({}));
            setMessage(res.ok ? "✓ Vick chamou no WhatsApp" : `✗ ${data.error || "Falhou"}`);
        } catch {
            setMessage("✗ Erro de conexão");
        } finally {
            setBusy(false);
        }
    };

    if (message) return <span className="text-xs text-muted-foreground">{message}</span>;
    return (
        <Button size="sm" variant="outline" onClick={contact} disabled={busy}>
            {busy ? <Loader2Icon className="w-4 h-4 mr-2 animate-spin" /> : <MessageCircleIcon className="w-4 h-4 mr-2" />}
            Vick chamar no WhatsApp
        </Button>
    );
}

export function LogoutButton() {
    const router = useRouter();
    return (
        <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
                await fetch("/api/painel/login", { method: "DELETE" });
                router.replace("/painel/login");
            }}
        >
            <LogOutIcon className="w-4 h-4 mr-2" /> Sair
        </Button>
    );
}

export function WeeklyChart({ data }: { data: Array<{ week: string; leads: number; meetings: number }> }) {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }}
                        cursor={{ fill: "hsl(var(--foreground) / 0.04)" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="leads" name="Leads" fill="#00A98A" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="meetings" name="Reuniões" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
