"use client";

// Lápis sobre a capa do artigo: só aparece para quem está logado no /painel.
// Permite enviar uma imagem do computador ou gerar outra com IA.

import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2Icon, PencilIcon, SparklesIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/functions";

const API = "/api/painel/blog-image";
const POLL_MS = 5000;
const POLL_LIMIT_MS = 4 * 60 * 1000;

// Uma checagem por página, compartilhada entre os lápis da listagem do blog
let sessionCheck: Promise<boolean> | null = null;
function checkSession(): Promise<boolean> {
    sessionCheck ??= fetch(API, { cache: "no-store" })
        .then(r => r.json())
        .then(data => data.ok === true)
        .catch(() => false);
    return sessionCheck;
}

interface Props {
    slug: string;
    title: string;
    hasImage: boolean;
    className?: string;
}

export function BlogCoverEditor({ slug, title, hasImage, className }: Props) {
    const [canEdit, setCanEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [busy, setBusy] = useState<"upload" | "ai" | null>(null);
    const [prompt, setPrompt] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        checkSession().then(setCanEdit);
    }, []);

    if (!canEdit) return null;

    const done = () => {
        setMessage("✓ Capa trocada. Atualizando a página…");
        // Recarrega sem cache para mostrar a nova imagem
        setTimeout(() => window.location.reload(), 800);
    };

    const upload = async (file: File) => {
        setBusy("upload");
        setMessage("Enviando e ajustando a imagem para o formato da capa…");
        try {
            const form = new FormData();
            form.append("slug", slug);
            form.append("file", file);
            const res = await fetch(API, { method: "POST", body: form });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Falhou");
            done();
        } catch (err) {
            setMessage(`✗ ${err instanceof Error ? err.message : "Erro de conexão"}`);
            setBusy(null);
        }
    };

    const generate = async () => {
        setBusy("ai");
        setMessage("Gerando a nova imagem com IA… leva de 30 segundos a 2 minutos.");
        try {
            const res = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, prompt }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Falhou");

            // A geração roda no servidor; acompanha até o ID da imagem mudar na planilha
            const started = Date.now();
            while (Date.now() - started < POLL_LIMIT_MS) {
                await new Promise(r => setTimeout(r, POLL_MS));
                const poll = await fetch(`${API}?slug=${encodeURIComponent(slug)}`, { cache: "no-store" }).then(r => r.json()).catch(() => ({}));
                if (poll.imageId && poll.imageId !== data.previousImageId) {
                    await fetch(API, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ slug, action: "revalidate" }),
                    });
                    done();
                    return;
                }
            }
            throw new Error("A imagem está demorando. Recarregue a página em alguns minutos.");
        } catch (err) {
            setMessage(`✗ ${err instanceof Error ? err.message : "Erro de conexão"}`);
            setBusy(null);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => {
                    setMessage(null);
                    setOpen(true);
                }}
                aria-label={hasImage ? "Trocar imagem da capa" : "Adicionar imagem de capa"}
                title={hasImage ? "Trocar imagem da capa" : "Adicionar imagem de capa"}
                className={cn(
                    "z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-3 py-2 text-xs font-medium text-white backdrop-blur hover:bg-brand-700",
                    className,
                )}
            >
                <PencilIcon className="h-3.5 w-3.5" /> {hasImage ? "Trocar capa" : "Adicionar capa"}
            </button>

            <Dialog open={open} onOpenChange={value => !busy && setOpen(value)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Imagem da capa</DialogTitle>
                        <DialogDescription>{title}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5">
                        <div>
                            <p className="text-sm font-medium text-foreground">Enviar uma imagem do computador</p>
                            <p className="mt-1 text-xs text-muted-foreground">JPG, PNG ou WebP até 10 MB. Ela é recortada no formato da capa (3:2).</p>
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={e => {
                                    const file = e.target.files?.[0];
                                    e.target.value = "";
                                    if (file) void upload(file);
                                }}
                            />
                            <Button className="mt-3" variant="outline" disabled={!!busy} onClick={() => fileRef.current?.click()}>
                                {busy === "upload" ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <UploadIcon className="mr-2 h-4 w-4" />}
                                Escolher imagem
                            </Button>
                        </div>

                        <div className="border-t border-foreground/10 pt-5">
                            <p className="text-sm font-medium text-foreground">Gerar outra com IA</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Opcional: descreva o que quer ver. Sem descrição, a IA cria outra versão sobre o tema do artigo.
                            </p>
                            <Textarea
                                className="mt-3"
                                rows={3}
                                maxLength={500}
                                placeholder="Ex.: prateleiras de um centro de distribuição com gráficos de previsão flutuando"
                                value={prompt}
                                disabled={!!busy}
                                onChange={e => setPrompt(e.target.value)}
                            />
                            <Button className="mt-3 bg-brand-700 text-white hover:bg-brand-600" disabled={!!busy} onClick={generate}>
                                {busy === "ai" ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <SparklesIcon className="mr-2 h-4 w-4" />}
                                Gerar nova imagem
                            </Button>
                        </div>

                        {message && <p className="text-sm text-muted-foreground">{message}</p>}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
