"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheckIcon, CalendarIcon, ClockIcon, Loader2Icon, VideoIcon } from "lucide-react";
import { cn } from "@/functions";
import { Button } from "../ui/button";

interface Slot { start: string; time: string }
interface Day { date: string; label: string; slots: Slot[] }
interface Confirmation { date: string; time: string; meetUrl: string }

const WHATSAPP_URL = "https://wa.me/5511926025637";

const inputClass = "w-full bg-foreground/[0.03] border border-foreground/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/[0.03] transition-all duration-200";
const labelClass = "text-xs font-medium text-muted-foreground uppercase tracking-wide";

// "terça-feira, 29 de setembro" → { weekday: "terça", day: "29 set" }
function shortLabel(day: Day) {
    const date = new Date(`${day.date}T12:00:00-03:00`);
    return {
        weekday: date.toLocaleDateString("pt-BR", { weekday: "short", timeZone: "America/Sao_Paulo" }).replace(".", ""),
        day: date.toLocaleDateString("pt-BR", { day: "numeric", month: "short", timeZone: "America/Sao_Paulo" }).replace(".", "").replace(" de ", " "),
    };
}

export function BookingForm() {
    const params = useSearchParams();
    const origin = (["vick", "whatsapp"] as const).find(o => o === params.get("origem")) ?? "site";

    const [days, setDays] = useState<Day[] | null>(null);
    const [loadError, setLoadError] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [form, setForm] = useState({
        name: params.get("nome") ?? "",
        email: params.get("email") ?? "",
        phone: params.get("telefone") ?? "",
        company: params.get("empresa") ?? "",
        notes: "",
        website: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

    const loadSlots = () => {
        setDays(null);
        setLoadError(false);
        fetch("/api/agenda/slots", { cache: "no-store" })
            .then(r => (r.ok ? r.json() : Promise.reject()))
            .then((data: { days: Day[] }) => {
                setDays(data.days);
                setSelectedDate(current => current ?? data.days[0]?.date ?? null);
            })
            .catch(() => setLoadError(true));
    };

    useEffect(loadSlots, []);

    const selectedDay = useMemo(() => days?.find(d => d.date === selectedDate) ?? null, [days, selectedDate]);

    const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            const res = await fetch("/api/agenda/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, start: selectedSlot.start, origin }),
            });
            const data = await res.json();
            if (!res.ok) {
                setSubmitError(data.error || "Não foi possível concluir o agendamento.");
                if (res.status === 409) {
                    setSelectedSlot(null);
                    loadSlots();
                }
                return;
            }
            setConfirmation({ date: data.date, time: data.time, meetUrl: data.meetUrl });
        } catch {
            setSubmitError("Não foi possível concluir o agendamento. Verifique sua conexão e tente de novo.");
        } finally {
            setSubmitting(false);
        }
    };

    if (confirmation) {
        return (
            <div className="max-w-xl mx-auto rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 text-center">
                <div className="w-14 h-14 rounded-full bg-violet-500/15 flex items-center justify-center mx-auto">
                    <CalendarCheckIcon className="w-7 h-7 text-violet-400" />
                </div>
                <h2 className="text-2xl font-heading font-semibold mt-5">Reunião confirmada! 🎉</h2>
                <p className="text-muted-foreground mt-3 first-letter:uppercase">
                    {confirmation.date}, às <strong className="text-foreground">{confirmation.time}</strong> (horário de Brasília).
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                    Enviamos o convite do Google Agenda e a confirmação para <strong className="text-foreground">{form.email}</strong>
                    {form.phone ? " e para o seu WhatsApp" : ""}.
                </p>
                {confirmation.meetUrl && (
                    <Button asChild size="lg" className="mt-6 bg-violet-600 hover:bg-violet-500 text-white">
                        <a href={confirmation.meetUrl} target="_blank" rel="noopener noreferrer">
                            <VideoIcon className="w-4 h-4 mr-2" />
                            Link da reunião (Google Meet)
                        </a>
                    </Button>
                )}
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="max-w-xl mx-auto rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 text-center">
                <p className="text-foreground font-medium">Não consegui carregar a agenda agora.</p>
                <p className="text-muted-foreground text-sm mt-2">Tente de novo ou fale com a gente pelo WhatsApp que marcamos por lá.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                    <Button variant="outline" onClick={loadSlots}>Tentar de novo</Button>
                    <Button asChild className="bg-[#25D366] hover:bg-[#20bd5a] text-white">
                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
                    </Button>
                </div>
            </div>
        );
    }

    if (!days) {
        return (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-16">
                <Loader2Icon className="w-5 h-5 animate-spin" />
                Carregando horários disponíveis…
            </div>
        );
    }

    if (days.length === 0) {
        return (
            <div className="max-w-xl mx-auto rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-8 text-center">
                <p className="text-foreground font-medium">Os próximos horários estão todos ocupados.</p>
                <p className="text-muted-foreground text-sm mt-2">Fale com a gente pelo WhatsApp que encontramos um horário para você.</p>
                <Button asChild className="mt-6 bg-[#25D366] hover:bg-[#20bd5a] text-white">
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Falar no WhatsApp</a>
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Dia e horário */}
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 md:p-6">
                <p className="flex items-center gap-2 font-medium">
                    <CalendarIcon className="w-4 h-4 text-violet-400" />
                    Escolha o dia
                </p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 pb-1">
                    {days.map(day => {
                        const { weekday, day: dayNum } = shortLabel(day);
                        const active = day.date === selectedDate;
                        return (
                            <button
                                key={day.date}
                                type="button"
                                onClick={() => { setSelectedDate(day.date); setSelectedSlot(null); }}
                                aria-pressed={active}
                                className={cn(
                                    "flex flex-col items-center min-w-[72px] px-3 py-2 rounded-xl border text-sm transition-all duration-200",
                                    active
                                        ? "bg-violet-600 border-violet-500 text-white"
                                        : "bg-foreground/[0.03] border-foreground/10 text-muted-foreground hover:border-violet-500/30 hover:text-foreground"
                                )}
                            >
                                <span className="text-xs uppercase tracking-wide">{weekday}</span>
                                <span className="font-semibold">{dayNum}</span>
                            </button>
                        );
                    })}
                </div>

                {selectedDay && (
                    <>
                        <p className="flex items-center gap-2 font-medium mt-6">
                            <ClockIcon className="w-4 h-4 text-violet-400" />
                            <span className="first-letter:uppercase">{selectedDay.label}</span>
                        </p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-4">
                            {selectedDay.slots.map(slot => {
                                const active = slot.start === selectedSlot?.start;
                                return (
                                    <button
                                        key={slot.start}
                                        type="button"
                                        onClick={() => setSelectedSlot(slot)}
                                        aria-pressed={active}
                                        className={cn(
                                            "py-2 rounded-lg border text-sm font-medium transition-all duration-200",
                                            active
                                                ? "bg-violet-600 border-violet-500 text-white"
                                                : "bg-foreground/[0.03] border-foreground/10 text-foreground/80 hover:border-violet-500/30"
                                        )}
                                    >
                                        {slot.time}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">Horário de Brasília · 30 minutos · Google Meet</p>
                    </>
                )}
            </div>

            {/* 2. Dados */}
            <div className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 md:p-6 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="booking-name" className={labelClass}>Nome *</label>
                    <input id="booking-name" required minLength={2} maxLength={80} value={form.name} onChange={update("name")} className={inputClass} placeholder="Seu nome" autoComplete="name" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="booking-email" className={labelClass}>E-mail *</label>
                        <input id="booking-email" type="email" required maxLength={120} value={form.email} onChange={update("email")} className={inputClass} placeholder="voce@empresa.com" autoComplete="email" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="booking-phone" className={labelClass}>WhatsApp *</label>
                        <input id="booking-phone" type="tel" required pattern="[\d\s()+\-]{10,20}" value={form.phone} onChange={update("phone")} className={inputClass} placeholder="(11) 99999-9999" autoComplete="tel" />
                    </div>
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="booking-company" className={labelClass}>Empresa</label>
                    <input id="booking-company" maxLength={100} value={form.company} onChange={update("company")} className={inputClass} placeholder="Nome da empresa" autoComplete="organization" />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="booking-notes" className={labelClass}>O que você quer resolver?</label>
                    <textarea id="booking-notes" rows={3} maxLength={1000} value={form.notes} onChange={update("notes")} className={cn(inputClass, "resize-none")} placeholder="Conte rapidamente o seu desafio (opcional)" />
                </div>
                {/* Campo invisível para robôs */}
                <input type="text" name="website" value={form.website} onChange={update("website")} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                {submitError && <p role="alert" className="text-sm text-red-400 light:text-red-600">{submitError}</p>}

                <Button type="submit" size="lg" disabled={!selectedSlot || submitting} className="w-full h-12 text-base font-semibold bg-violet-600 hover:bg-violet-500 text-white disabled:opacity-60">
                    {submitting ? (
                        <span className="flex items-center gap-2"><Loader2Icon className="w-4 h-4 animate-spin" /> Agendando…</span>
                    ) : selectedSlot ? (
                        `Confirmar ${selectedSlot.time}`
                    ) : (
                        "Escolha um horário"
                    )}
                </Button>
            </div>
        </form>
    );
}
