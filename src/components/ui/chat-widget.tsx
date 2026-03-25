"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { XIcon, SendIcon, BotIcon, MinimizeIcon } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

function generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(generateSessionId);
    const [started, setStarted] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Iniciar sessão ao abrir pela primeira vez
    useEffect(() => {
        if (open && !started) {
            setStarted(true);
            setLoading(true);
            fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId }),
            })
                .then((r) => r.json())
                .then((data) => {
                    if (data.message) {
                        setMessages([{ role: "assistant", content: data.message }]);
                    }
                })
                .catch(() => {
                    setMessages([{ role: "assistant", content: "Olá! Sou a Vick, assistente da Adone AI 👋 Como posso ajudar?" }]);
                })
                .finally(() => setLoading(false));
        }
    }, [open, started, sessionId]);

    // Scroll para última mensagem
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    // Foco no input ao abrir
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 300);
    }, [open]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        setInput("");
        setMessages((prev) => [...prev, { role: "user", content: text }]);
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, message: text }),
            });
            const data = await res.json();
            if (data.message) {
                setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
            }
        } catch {
            setMessages((prev) => [...prev, { role: "assistant", content: "Desculpe, tive um problema técnico. Pode tentar novamente?" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKey = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Botão flutuante */}
            <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Abrir chat com Vick"
                className="fixed bottom-24 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 shadow-lg transition-all duration-300 hover:scale-110 group"
            >
                {open ? (
                    <MinimizeIcon className="w-6 h-6 text-white" />
                ) : (
                    <BotIcon className="w-6 h-6 text-white" />
                )}
                {!open && (
                    <span className="absolute right-16 bg-white text-gray-800 text-xs font-medium px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        Falar com a Vick
                    </span>
                )}
            </button>

            {/* Janela do chat */}
            {open && (
                <div className="fixed bottom-44 right-6 z-50 w-[350px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl border border-violet-500/20 bg-neutral-950 shadow-2xl overflow-hidden"
                    style={{ height: "480px" }}>

                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-violet-600">
                        <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <Image src="/img/logo2.png" alt="Vick" width={24} height={16} className="w-auto h-4 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white leading-tight">Vick</p>
                            <p className="text-xs text-violet-200">Assistente da Adone AI • Online</p>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mensagens */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                                    msg.role === "user"
                                        ? "bg-violet-600 text-white rounded-br-sm"
                                        : "bg-white/5 border border-white/10 text-foreground/90 rounded-bl-sm"
                                }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 px-3 py-2 rounded-2xl rounded-bl-sm">
                                    <div className="flex gap-1 items-center h-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
                                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="px-3 py-3 border-t border-white/5 flex gap-2 items-center bg-neutral-900/80">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKey}
                            placeholder="Digite sua mensagem..."
                            disabled={loading}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500/50 transition-all disabled:opacity-50"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || loading}
                            className="w-9 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 flex items-center justify-center transition-all flex-shrink-0"
                        >
                            <SendIcon className="w-4 h-4 text-white" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
