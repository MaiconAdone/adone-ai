"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    Cloud,
    CreditCard,
    Download,
    FileText,
    Flame,
    Hammer,
    Languages,
    Layers,
    Ruler,
    Sofa,
    Sparkles,
    Star,
    TreePine,
    Warehouse,
    BedDouble,
    Gift,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import Tilt from "react-parallax-tilt";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    BONUS,
    CATEGORIAS,
    CHECKOUT_URL,
    PRECO_ACERVO,
    TOTAL_PAGINAS,
    TOTAL_PDFS,
    TODAS,
    type CategoriaProjetos,
} from "@/constants/projetos-madeira";

const ICONES: Record<string, typeof Flame> = {
    gourmet: Flame,
    industriais: Warehouse,
    marcenaria: Ruler,
    quarto: BedDouble,
    sala: Sofa,
    jardim: TreePine,
    guias: BookOpen,
    bonus: Gift,
};

const ANEL = [
    "areas-gourmet",
    "industriais-350",
    "cozinhas-caipiras",
    "projeto-marcenaria",
    "rusticos-paletes",
    "bancadas-pias",
    "gavetero",
    "moveis-palets",
    "churrasqueira",
    "man-cave",
    "cantinho-cachaca",
    "armario-banheiro",
];

const POR_DENTRO = [
    { img: "industriais-interna", legenda: "Móveis industriais: peça a peça" },
    { img: "marcenaria-interna", legenda: "Recorte detalhado com cotas" },
    { img: "areas-gourmet-sumario", legenda: "12 áreas gourmet completas" },
    { img: "rusticos-interna", legenda: "Montagem passo a passo" },
    { img: "cozinha-caipira-interna", legenda: "Materiais e desenhos construtivos" },
    { img: "curso-marcenaria", legenda: "Técnicas ilustradas" },
];

const fmt = (n: number) => n.toLocaleString("pt-BR");
const img = (slug: string) => `/projetos-madeira/${slug}.webp`;

const CSS = `
@keyframes pm-spin { from { transform: rotateY(0deg); } to { transform: rotateY(-360deg); } }
@keyframes pm-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
@keyframes pm-border { to { --pm-angle: 360deg; } }
@property --pm-angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
.pm-ring { animation: pm-spin 48s linear infinite; transform-style: preserve-3d; }
.pm-scene:hover .pm-ring { animation-play-state: paused; }
.pm-float { animation: pm-float 6s ease-in-out infinite; }
.pm-glow-border { background: conic-gradient(from var(--pm-angle), #f59e0b, #7c2d12, #fde68a, #b45309, #f59e0b); animation: pm-border 6s linear infinite; }
.pm-grain { background-image: radial-gradient(rgba(255,255,255,.035) 1px, transparent 1px); background-size: 3px 3px; }
.pm-wood { background: repeating-linear-gradient(100deg, rgba(120,72,32,.10) 0 2px, transparent 2px 14px), linear-gradient(180deg,#140d08,#0d0805); }
@media (prefers-reduced-motion: reduce) { .pm-ring, .pm-float, .pm-glow-border { animation: none; } }
`;

function Cta({ className = "", children }: { className?: string; children?: React.ReactNode }) {
    return (
        <Link
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-b from-amber-300 to-amber-500 px-7 py-4 text-base font-bold text-stone-950 shadow-[0_10px_0_#92400e,0_18px_40px_rgba(245,158,11,.35)] transition-all hover:translate-y-[2px] hover:shadow-[0_8px_0_#92400e,0_14px_30px_rgba(245,158,11,.4)] active:translate-y-[8px] active:shadow-[0_2px_0_#92400e] ${className}`}
        >
            {children ?? <>Quero o acervo por R$ {PRECO_ACERVO}</>}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>
    );
}

/* Anel 3D de capas que gira e inclina com o ponteiro */
function AnelCapas() {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const rx = useSpring(useTransform(my, [-1, 1], [14, -6]), { stiffness: 80, damping: 18 });
    const ry = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 80, damping: 18 });

    const onMove = (e: PointerEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
    };

    const n = ANEL.length;
    return (
        <div
            className="pm-scene relative mx-auto h-[280px] w-full max-w-[560px] sm:h-[460px]"
            style={{ perspective: "1300px" }}
            onPointerMove={onMove}
            onPointerLeave={() => {
                mx.set(0);
                my.set(0);
            }}
        >
            <motion.div className="absolute inset-0" style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}>
                <div className="absolute left-1/2 top-1/2 scale-[.45] sm:scale-[.72] lg:scale-[.6] xl:scale-[.85]" style={{ transformStyle: "preserve-3d" }}>
                    <div className="pm-ring relative" style={{ transformStyle: "preserve-3d" }}>
                        {ANEL.map((slug, i) => (
                            <div
                                key={slug}
                                className="absolute -left-[78px] -top-[108px] h-[216px] w-[156px] overflow-hidden rounded-md border border-amber-200/20 bg-stone-900 shadow-[0_20px_50px_rgba(0,0,0,.6)]"
                                style={{ transform: `rotateY(${(360 / n) * i}deg) translateZ(300px)`, backfaceVisibility: "hidden" }}
                            >
                                <Image src={img(slug)} alt="" fill sizes="160px" className="object-cover object-top" />
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/10" />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Pasta do Drive flutuando no centro */}
                <div
                    className="pm-float absolute left-1/2 top-1/2 -ml-[70px] -mt-[58px] flex h-[116px] w-[140px] flex-col items-center justify-center rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-400 to-orange-700 text-stone-950 shadow-[0_30px_60px_rgba(245,158,11,.35)]"
                    style={{ transform: "translateZ(40px)" }}
                >
                    <Cloud className="h-8 w-8" />
                    <span className="mt-1 text-xs font-bold uppercase tracking-wider">Google Drive</span>
                    <span className="text-[11px] font-semibold opacity-80">{TOTAL_PDFS} PDFs</span>
                </div>
            </motion.div>
            <div className="pointer-events-none absolute bottom-2 left-1/2 h-16 w-3/4 -translate-x-1/2 rounded-[50%] bg-amber-500/25 blur-3xl" />
        </div>
    );
}

/* Pilha 3D de capas da categoria, que se abre em leque no hover */
function PilhaCapas({ capas, nome }: { capas: string[]; nome: string }) {
    const lista = capas.slice(0, 4).reverse(); // a primeira capa fica na frente
    return (
        <div className="group relative mx-auto h-[300px] w-[220px] translate-x-10 sm:h-[330px] sm:w-[245px]" style={{ perspective: "1100px" }}>
            {lista.map((slug, i) => {
                const k = lista.length - 1 - i;
                return (
                    <div
                        key={slug}
                        className="absolute inset-0 overflow-hidden rounded-lg border border-amber-100/15 bg-stone-900 shadow-[0_25px_50px_rgba(0,0,0,.55)] transition-transform duration-500 ease-out"
                        style={
                            {
                                transform: `rotateY(-18deg) rotateX(6deg) translate3d(${-k * 30}px, ${-k * 16}px, ${-k * 40}px)`,
                                zIndex: i,
                                "--fan": `rotateY(-8deg) rotateZ(${k * -6}deg) translate3d(${-k * 64}px, ${-k * 6}px, ${-k * 30}px)`,
                            } as React.CSSProperties
                        }
                    >
                        <Image src={img(slug)} alt={i === lista.length - 1 ? `Página do acervo: ${nome}` : ""} fill sizes="260px" className="object-cover object-top" />
                        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/50 to-transparent" />
                    </div>
                );
            })}
            <style>{`.group:hover > div[style*="--fan"] { transform: var(--fan) !important; }`}</style>
        </div>
    );
}

function ExploradorCategorias({ ativa, setAtiva }: { ativa: string; setAtiva: (id: string) => void }) {
    const cat = TODAS.find((c) => c.id === ativa) ?? TODAS[0];
    const paginas = cat.projetos.reduce((s, p) => s + p.paginas, 0);
    const Icone = ICONES[cat.id] ?? Hammer;

    return (
        <div>
            <div className="sticky top-0 z-20 -mx-4 mb-10 overflow-x-auto px-4 py-3 [scrollbar-width:none]">
                <div className="mx-auto flex w-max gap-2 rounded-2xl border border-amber-100/10 bg-stone-950/80 p-1.5 backdrop-blur-xl">
                    {TODAS.map((c) => {
                        const I = ICONES[c.id] ?? Hammer;
                        const on = c.id === cat.id;
                        return (
                            <button
                                key={c.id}
                                type="button"
                                onClick={() => setAtiva(c.id)}
                                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-semibold transition-all ${
                                    on
                                        ? "bg-amber-400 text-stone-950 shadow-[0_4px_0_#92400e]"
                                        : "text-amber-50/70 hover:bg-amber-50/5 hover:text-amber-50"
                                }`}
                            >
                                <I className="h-4 w-4" />
                                {c.nome.split(":")[0].split(",")[0]}
                            </button>
                        );
                    })}
                </div>
            </div>

            <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 24, rotateX: -6 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="grid items-start gap-10 lg:grid-cols-[320px_1fr]"
                style={{ perspective: "1200px" }}
            >
                <div className="lg:sticky lg:top-24">
                    <PilhaCapas capas={cat.capas} nome={cat.nome} />
                    <p className="mt-6 text-center text-xs text-amber-50/50">Passe o mouse para abrir em leque</p>
                </div>

                <div>
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                            <Icone className="h-5 w-5" />
                        </span>
                        <span className="rounded-full border border-amber-300/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-300">
                            {cat.chamada}
                        </span>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-amber-50 sm:text-3xl">{cat.nome}</h3>
                    <p className="mt-3 max-w-2xl leading-7 text-amber-50/70">{cat.descricao}</p>
                    <div className="mt-5 flex flex-wrap gap-2 text-sm">
                        <span className="rounded-lg bg-amber-50/5 px-3 py-1.5 text-amber-50/80">
                            <FileText className="mr-1.5 inline h-4 w-4 text-amber-300" />
                            {cat.projetos.length} {cat.projetos.length === 1 ? "PDF" : "PDFs"}
                        </span>
                        <span className="rounded-lg bg-amber-50/5 px-3 py-1.5 text-amber-50/80">
                            <Layers className="mr-1.5 inline h-4 w-4 text-amber-300" />
                            {fmt(paginas)} páginas
                        </span>
                        <span className="rounded-lg bg-amber-50/5 px-3 py-1.5 text-amber-50/80">
                            <Hammer className="mr-1.5 inline h-4 w-4 text-amber-300" />
                            {cat.nivel}
                        </span>
                    </div>

                    <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                        {cat.projetos.map((p, i) => (
                            <motion.li
                                key={p.titulo}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(i * 0.03, 0.4) }}
                                className={`relative rounded-xl border p-4 transition-all hover:-translate-y-1 hover:shadow-[0_16px_30px_rgba(0,0,0,.45)] ${
                                    p.destaque
                                        ? "border-amber-300/40 bg-gradient-to-br from-amber-400/[0.12] to-transparent"
                                        : "border-amber-100/10 bg-amber-50/[0.03]"
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <h4 className="font-semibold leading-snug text-amber-50">
                                        {p.destaque && <Star className="mr-1 inline h-3.5 w-3.5 -translate-y-px fill-amber-300 text-amber-300" />}
                                        {p.titulo}
                                    </h4>
                                    <span className="shrink-0 rounded-md bg-stone-950/60 px-2 py-0.5 text-xs font-bold text-amber-300">
                                        {p.paginas} p.
                                    </span>
                                </div>
                                <p className="mt-1.5 text-sm leading-6 text-amber-50/60">{p.resumo}</p>
                                {p.idioma && p.idioma !== "PT" && (
                                    <span className="mt-2 inline-flex items-center gap-1 rounded bg-sky-400/10 px-2 py-0.5 text-[11px] font-semibold text-sky-300">
                                        <Languages className="h-3 w-3" />
                                        {p.idioma === "ES" ? "Em espanhol" : "Em inglês"} · desenhos e medidas universais
                                    </span>
                                )}
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </div>
    );
}

function CardCategoria({ c, onClick }: { c: CategoriaProjetos; onClick: () => void }) {
    const Icone = ICONES[c.id] ?? Hammer;
    const paginas = c.projetos.reduce((s, p) => s + p.paginas, 0);
    return (
        <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={900} glareEnable glareMaxOpacity={0.18} glareColor="#fde68a" glareBorderRadius="18px" scale={1.02} className="h-full">
            <button
                type="button"
                onClick={onClick}
                className="group relative flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-amber-100/10 bg-stone-900 text-left"
                style={{ transformStyle: "preserve-3d" }}
            >
                <div className="relative h-44 overflow-hidden">
                    <Image src={img(c.capas[0])} alt={c.nome} fill sizes="(max-width:768px) 100vw, 380px" className="object-cover object-top opacity-80 transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-stone-950/70 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur" style={{ transform: "translateZ(30px)" }}>
                        {c.chamada}
                    </span>
                </div>
                <div className="flex flex-1 flex-col p-5" style={{ transform: "translateZ(20px)" }}>
                    <Icone className="h-6 w-6 text-amber-300" />
                    <h3 className="mt-3 text-lg font-bold leading-snug text-amber-50">{c.nome}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-amber-50/60">{c.descricao}</p>
                    <div className="mt-auto flex items-center justify-between pt-5 text-sm">
                        <span className="text-amber-50/70">
                            {c.projetos.length} PDFs · {fmt(paginas)} p.
                        </span>
                        <span className="font-semibold text-amber-300 transition-transform group-hover:translate-x-1">Ver →</span>
                    </div>
                </div>
            </button>
        </Tilt>
    );
}

const FAQ = [
    {
        q: "Como recebo os arquivos?",
        a: "Assim que o pagamento é confirmado, você recebe o link de acesso à pasta do acervo no Google Drive. Dá para ver online ou baixar os PDFs no celular, tablet ou computador.",
    },
    {
        q: "Preciso ter conta Google?",
        a: "Para visualizar, basta abrir o link. Com uma conta Google (gratuita) você também pode salvar a pasta no seu próprio Drive.",
    },
    {
        q: "O pagamento é único?",
        a: `Sim. São R$ ${PRECO_ACERVO} uma única vez, sem mensalidade.`,
    },
    {
        q: "Os projetos estão em português?",
        a: "A grande maioria, sim. Alguns planos técnicos (gaveteiros, mesas de carpintaria e dois móveis) estão em espanhol e dois guias em inglês — eles estão sinalizados na lista e trazem desenhos e medidas que se entendem sem tradução.",
    },
    {
        q: "Serve para iniciantes?",
        a: "Sim. A categoria \"Cursos, guias e coletâneas\" e o curso de marcenaria básico são o ponto de partida. Os projetos de paletes usam poucas ferramentas; marcenaria e alvenaria trazem medidas e lista de materiais para quem quer ir além.",
    },
    {
        q: "Posso imprimir?",
        a: "Pode. Os arquivos são PDF e podem ser impressos para levar à oficina ou à obra.",
    },
];

export function AcervoMadeira() {
    const [ativa, setAtiva] = useState(CATEGORIAS[0].id);
    const explorador = useRef<HTMLDivElement>(null);

    const abrir = (id: string) => {
        setAtiva(id);
        explorador.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="pm-wood relative overflow-hidden text-amber-50">
            <style>{CSS}</style>
            <div className="pm-grain pointer-events-none absolute inset-0" />

            {/* HERO */}
            <section className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 pb-16 pt-16 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
                <div className="pointer-events-none absolute -left-40 top-10 h-[480px] w-[480px] rounded-full bg-amber-600/20 blur-[120px]" />
                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/25 bg-amber-400/10 px-4 py-1.5 text-sm font-medium text-amber-200">
                        <Sparkles className="h-4 w-4" />
                        Acervo digital · acesso imediato pelo Google Drive
                    </span>
                    <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                        <span className="bg-gradient-to-b from-amber-100 to-amber-400 bg-clip-text text-transparent">+{fmt(Math.floor(TOTAL_PAGINAS / 100) * 100)} páginas</span>
                        <br />
                        de projetos em madeira para você construir.
                    </h1>
                    <p className="mt-6 max-w-xl text-lg leading-8 text-amber-50/70">
                        Móveis industriais, marcenaria com plano de corte, móveis de paletes, áreas gourmet, fogões a lenha e cozinhas caipiras — {TOTAL_PDFS} PDFs organizados em {CATEGORIAS.length} categorias + {BONUS.projetos.length} bônus, com medidas, materiais e passo a passo.
                    </p>
                    <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <Cta />
                        <a href="#categorias" className="text-center font-semibold text-amber-200 underline-offset-4 hover:underline">
                            Ver o que tem dentro ↓
                        </a>
                    </div>
                    <p className="mt-5 flex items-center gap-2 text-sm text-amber-50/50">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        Pagamento único · sem mensalidade · leia no celular ou imprima
                    </p>
                </div>
                <AnelCapas />
            </section>

            {/* NÚMEROS */}
            <section className="relative mx-auto max-w-6xl px-4">
                <div className="grid grid-cols-2 gap-3 rounded-3xl border border-amber-100/10 bg-stone-950/50 p-3 backdrop-blur sm:grid-cols-4">
                    {[
                        [`+${fmt(Math.floor(TOTAL_PAGINAS / 100) * 100)}`, "páginas de conteúdo"],
                        ["+1.000", "projetos e ideias"],
                        [String(TOTAL_PDFS), "PDFs organizados"],
                        [`${CATEGORIAS.length} + ${BONUS.projetos.length}`, "categorias + bônus"],
                    ].map(([v, l]) => (
                        <div key={l} className="rounded-2xl bg-gradient-to-b from-amber-50/[0.06] to-transparent p-5 text-center">
                            <strong className="block text-3xl font-black text-amber-300 sm:text-4xl">{v}</strong>
                            <span className="text-sm text-amber-50/60">{l}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* MAPA DO ACERVO */}
            <section id="categorias" className="relative mx-auto max-w-7xl scroll-mt-24 px-4 pt-28">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Mapa do acervo</p>
                    <h2 className="mt-3 text-3xl font-black sm:text-4xl">Tudo separado pelo que você quer construir</h2>
                    <p className="mt-4 text-amber-50/60">Escolha uma categoria para ver cada PDF, quantas páginas tem e o que você aprende nele.</p>
                </div>
                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {TODAS.map((c) => (
                        <div key={c.id}>
                            <CardCategoria c={c} onClick={() => abrir(c.id)} />
                        </div>
                    ))}
                </div>
            </section>

            {/* EXPLORADOR */}
            <section ref={explorador} className="relative mx-auto max-w-7xl scroll-mt-16 px-4 pt-24">
                <div className="mx-auto mb-4 max-w-2xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Lista completa</p>
                    <h2 className="mt-3 text-3xl font-black sm:text-4xl">Todos os {TOTAL_PDFS} PDFs, um por um</h2>
                </div>
                <ExploradorCategorias ativa={ativa} setAtiva={setAtiva} />
            </section>

            {/* POR DENTRO */}
            <section className="relative mx-auto max-w-7xl px-4 pt-28">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Veja por dentro</p>
                    <h2 className="mt-3 text-3xl font-black sm:text-4xl">Páginas reais do acervo</h2>
                    <p className="mt-4 text-amber-50/60">Medidas, recortes, lista de materiais e fotos de cada etapa.</p>
                </div>
                <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3" style={{ perspective: "1400px" }}>
                    {POR_DENTRO.map((p, i) => (
                        <motion.figure
                            key={p.img}
                            initial={{ opacity: 0, rotateY: i % 2 ? 25 : -25, y: 40 }}
                            whileInView={{ opacity: 1, rotateY: i % 3 === 0 ? 8 : i % 3 === 2 ? -8 : 0, y: 0 }}
                            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.04, z: 40 }}
                            viewport={{ once: true, margin: "-80px" }}
                            transition={{ type: "spring", stiffness: 90, damping: 16 }}
                            className="group"
                            style={{ transformStyle: "preserve-3d" }}
                        >
                            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-amber-100/15 bg-white shadow-[0_30px_60px_rgba(0,0,0,.55)]">
                                <Image src={img(p.img)} alt={p.legenda} fill sizes="(max-width:768px) 50vw, 400px" className="object-cover object-top" />
                            </div>
                            <figcaption className="mt-3 text-center text-sm font-medium text-amber-50/70">{p.legenda}</figcaption>
                        </motion.figure>
                    ))}
                </div>
            </section>

            {/* COMO FUNCIONA */}
            <section className="relative mx-auto max-w-6xl px-4 pt-28">
                <div className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Como funciona</p>
                    <h2 className="mt-3 text-3xl font-black sm:text-4xl">Do pagamento ao primeiro projeto em minutos</h2>
                </div>
                <div className="mt-12 grid gap-5 md:grid-cols-3">
                    {[
                        { icon: CreditCard, t: `Pague R$ ${PRECO_ACERVO}`, d: "Pagamento único e seguro, sem mensalidade." },
                        { icon: Cloud, t: "Receba o link do Drive", d: "O acesso à pasta completa no Google Drive é liberado após a confirmação." },
                        { icon: Download, t: "Abra, baixe e construa", d: "Leia no celular, salve no seu Drive ou imprima para a oficina." },
                    ].map((s, i) => (
                        <Tilt key={s.t} tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={800} className="h-full">
                            <div className="relative h-full rounded-2xl border border-amber-100/10 bg-gradient-to-b from-stone-900 to-stone-950 p-7" style={{ transformStyle: "preserve-3d" }}>
                                <span className="absolute right-6 top-4 text-6xl font-black text-amber-50/[0.06]">{i + 1}</span>
                                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 to-amber-600 text-stone-950 shadow-[0_8px_20px_rgba(245,158,11,.35)]" style={{ transform: "translateZ(40px)" }}>
                                    <s.icon className="h-6 w-6" />
                                </span>
                                <h3 className="mt-5 text-xl font-bold" style={{ transform: "translateZ(25px)" }}>{s.t}</h3>
                                <p className="mt-2 text-amber-50/60">{s.d}</p>
                            </div>
                        </Tilt>
                    ))}
                </div>
            </section>

            {/* OFERTA */}
            <section id="oferta" className="relative mx-auto max-w-3xl scroll-mt-24 px-4 pt-28">
                <Tilt tiltMaxAngleX={6} tiltMaxAngleY={6} perspective={1200} glareEnable glareMaxOpacity={0.12} glareColor="#fde68a" glareBorderRadius="28px">
                    <div className="pm-glow-border rounded-[28px] p-[2px] shadow-[0_40px_100px_rgba(245,158,11,.25)]">
                        <div className="rounded-[26px] bg-gradient-to-b from-stone-900 to-stone-950 p-8 sm:p-12" style={{ transformStyle: "preserve-3d" }}>
                            <div className="text-center" style={{ transform: "translateZ(30px)" }}>
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-amber-400">Acervo completo</p>
                                <h2 className="mt-3 text-3xl font-black sm:text-4xl">Projetos em Madeira</h2>
                                <div className="mt-6 flex items-end justify-center gap-2">
                                    <span className="pb-2 text-xl font-bold text-amber-200">R$</span>
                                    <span className="bg-gradient-to-b from-amber-100 to-amber-400 bg-clip-text text-7xl font-black leading-none text-transparent">{PRECO_ACERVO}</span>
                                </div>
                                <p className="mt-2 text-sm text-amber-50/60">pagamento único · acesso pelo Google Drive</p>
                            </div>
                            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                                {CATEGORIAS.map((c) => (
                                    <li key={c.id} className="flex gap-2.5 text-sm text-amber-50/80">
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                                        {c.nome}
                                    </li>
                                ))}
                                {BONUS.projetos.map((b) => (
                                    <li key={b.titulo} className="flex gap-2.5 text-sm text-amber-50/80">
                                        <Gift className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                                        {b.titulo}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-10 flex justify-center" style={{ transform: "translateZ(40px)" }}>
                                <Cta className="w-full sm:w-auto" />
                            </div>
                        </div>
                    </div>
                </Tilt>
            </section>

            {/* FAQ */}
            <section className="relative mx-auto max-w-3xl px-4 pt-28">
                <h2 className="text-center text-3xl font-black sm:text-4xl">Perguntas frequentes</h2>
                <Accordion type="single" collapsible className="mt-10">
                    {FAQ.map((f) => (
                        <AccordionItem key={f.q} value={f.q} className="border-amber-100/10">
                            <AccordionTrigger className="text-left text-base font-semibold text-amber-50 hover:no-underline">{f.q}</AccordionTrigger>
                            <AccordionContent className="text-base leading-7 text-amber-50/65">{f.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* CTA FINAL */}
            <section className="relative mx-auto max-w-4xl px-4 pb-28 pt-24 text-center">
                <h2 className="text-3xl font-black sm:text-5xl">
                    Sua próxima peça começa
                    <span className="bg-gradient-to-b from-amber-100 to-amber-400 bg-clip-text text-transparent"> no papel.</span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-amber-50/60">
                    {TOTAL_PDFS} PDFs, {fmt(TOTAL_PAGINAS)} páginas, {CATEGORIAS.length} categorias e {BONUS.projetos.length} bônus por menos que o preço de uma tábua.
                </p>
                <div className="mt-9 flex justify-center">
                    <Cta />
                </div>
            </section>
        </div>
    );
}
