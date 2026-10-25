"use client";

// Gráfico interativo da Bíblia Conectada. Os arquivos em /public/biblia-conectada são gerados
// pelo projeto biblia-conectada (scripts/export_site.py); o fundo arcs_bg.jpg tem largura BG_W
// e a base dos arcos em BG_W / 2 + PAD.
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/functions";

const BASE = "/biblia-conectada/";
const BG_W = 2400;
const PAD = 8;
const GRADIENT = [[255, 199, 77], [255, 115, 64], [230, 51, 140], [128, 64, 242]];
const THEME_TREE = ["Gn 2:9", "Gn 3:24", "Ez 47:12", "Ap 22:1", "Ap 22:2", "Ap 22:14"];

type Book = { osis: string; name: string; abbr: string; chapters: number[] };
type Data = {
    books: Book[];
    n: number;
    nv: number;
    nch: number;
    from: Int32Array;
    to: Int32Array;
    votes: Int16Array;
    span: Int16Array;
    pos: Float64Array;
    bookOf: Int16Array;
    chap: Int16Array;
    verse: Int16Array;
    bookStart: number[];
    adj: Int32Array;
    deg: Int32Array;
    lookup: Map<string, number>;
};
type View =
    | { kind: "none" }
    | { kind: "verse"; i: number }
    | { kind: "pair"; ids: [number, number]; title: string }
    | { kind: "theme"; ids: number[]; title: string };
type Neighbor = { o: number; l: number; votes: number };

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "");

function color(t: number, a: number) {
    t = Math.min(1, Math.max(0, t)) * (GRADIENT.length - 1);
    const i = Math.min(Math.floor(t), GRADIENT.length - 2), f = t - i;
    const c = GRADIENT[i].map((v, k) => Math.round(v * (1 - f) + GRADIENT[i + 1][k] * f));
    return `rgba(${c[0]},${c[1]},${c[2]},${a})`;
}

async function loadData(): Promise<Data> {
    const [meta, buf] = await Promise.all([
        fetch(BASE + "meta.json").then((r) => r.json()),
        fetch(BASE + "links.bin").then((r) => r.arrayBuffer()),
    ]);
    const books: Book[] = meta.books;
    const n: number = meta.links, nv: number = meta.verses;
    const from = new Int32Array(buf, 0, n), to = new Int32Array(buf, 4 * n, n);
    const votes = new Int16Array(buf.slice(8 * n, 10 * n)), span = new Int16Array(buf.slice(10 * n, 12 * n));

    // posição 0..1 de cada versículo: capítulos com largura igual, versículo dentro da barra
    const nch = books.reduce((s, b) => s + b.chapters.length, 0);
    const pos = new Float64Array(nv), bookOf = new Int16Array(nv), chap = new Int16Array(nv), verse = new Int16Array(nv);
    const bookStart: number[] = [];
    let vi = 0, ci = 0;
    books.forEach((b, bi) => {
        bookStart.push(vi);
        b.chapters.forEach((cnt, c) => {
            for (let v = 0; v < cnt; v++, vi++) {
                pos[vi] = (ci + (v + 0.5) / cnt) / nch;
                bookOf[vi] = bi; chap[vi] = c + 1; verse[vi] = v + 1;
            }
            ci++;
        });
    });

    // adjacência (CSR) com as ligações nos dois sentidos
    const deg = new Int32Array(nv + 1);
    for (let i = 0; i < n; i++) { deg[from[i] + 1]++; deg[to[i] + 1]++; }
    for (let i = 0; i < nv; i++) deg[i + 1] += deg[i];
    const adj = new Int32Array(2 * n), fill = deg.slice(0, nv);
    for (let i = 0; i < n; i++) { adj[fill[from[i]]++] = i; adj[fill[to[i]]++] = i; }

    const lookup = new Map<string, number>();
    books.forEach((b, i) => { lookup.set(norm(b.abbr), i); lookup.set(norm(b.name), i); lookup.set(norm(b.osis), i); });
    return { books, n, nv, nch, from, to, votes, span, pos, bookOf, chap, verse, bookStart, adj, deg, lookup };
}

export function ArcExplorer() {
    const stageRef = useRef<HTMLDivElement>(null);
    const fxRef = useRef<HTMLCanvasElement>(null);
    const barsRef = useRef<HTMLCanvasElement>(null);
    const texts = useRef(new Map<number, string[] | "loading">());

    const [data, setData] = useState<Data | null>(null);
    const [width, setWidth] = useState(0);
    const [view, setView] = useState<View>({ kind: "none" });
    const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);
    const [hoverLink, setHoverLink] = useState(-1);
    const [minVotes, setMinVotes] = useState(0);
    const [query, setQuery] = useState("");
    const [, setTextVersion] = useState(0);

    useEffect(() => { loadData().then(setData); }, []);

    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const ro = new ResizeObserver(() => setWidth(el.clientWidth));
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // ---------- texto (um arquivo por livro, sob demanda) ----------
    const text = useCallback((i: number): string | undefined => {
        if (!data) return undefined;
        const b = data.bookOf[i];
        const cached = texts.current.get(b);
        if (Array.isArray(cached)) return cached[i - data.bookStart[b]];
        if (!cached) {
            texts.current.set(b, "loading");
            fetch(`${BASE}text/${data.books[b].osis}.json`)
                .then((r) => r.json())
                .then((arr: string[]) => { texts.current.set(b, arr); setTextVersion((v) => v + 1); })
                .catch(() => texts.current.delete(b));
        }
        return undefined;
    }, [data]);

    const ref = useCallback((i: number) => data ? `${data.books[data.bookOf[i]].abbr} ${data.chap[i]}:${data.verse[i]}` : "", [data]);

    const parseRef = useCallback((s: string) => {
        if (!data) return -1;
        const m = s.trim().match(/^(.+?)\s*(\d+)\s*[:.,]\s*(\d+)$/);
        if (!m) return -1;
        const key = norm(m[1]);
        let b = data.lookup.get(key);
        if (b === undefined) b = data.books.findIndex((bk) => norm(bk.name).startsWith(key));
        if (b < 0) return -1;
        const c = +m[2], v = +m[3], chapters = data.books[b].chapters;
        if (c < 1 || c > chapters.length || v < 1 || v > chapters[c - 1]) return -1;
        let i = data.bookStart[b];
        for (let k = 0; k < c - 1; k++) i += chapters[k];
        return i + v - 1;
    }, [data]);

    // vizinhos únicos (A->B e B->A contam uma vez; fica o maior voto)
    const neighbors = useCallback((i: number): Neighbor[] => {
        if (!data) return [];
        const best = new Map<number, number>();
        for (let k = data.deg[i]; k < data.deg[i + 1]; k++) {
            const l = data.adj[k];
            if (data.votes[l] < minVotes) continue;
            const o = data.from[l] === i ? data.to[l] : data.from[l];
            if (o === i) continue;
            const prev = best.get(o);
            if (prev === undefined || data.votes[l] > data.votes[prev]) best.set(o, l);
        }
        return [...best.entries()].map(([o, l]) => ({ o, l, votes: data.votes[l] })).sort((a, b) => b.votes - a.votes);
    }, [data, minVotes]);

    const selected = view.kind === "verse" ? view.i : -1;
    const list = useMemo(() => (selected >= 0 ? neighbors(selected) : []), [selected, neighbors]);

    // ---------- desenho ----------
    useEffect(() => {
        const fx = fxRef.current, bars = barsRef.current;
        if (!data || !fx || !bars || !width) return;
        const dpr = window.devicePixelRatio || 1, S = width / BG_W;
        const fxH = (BG_W / 2 + PAD + 1) * S, barsH = width * 0.06, baseY = (BG_W / 2 + PAD) * S;
        for (const [c, h] of [[fx, fxH], [bars, barsH]] as const) {
            if (c.width !== Math.round(width * dpr) || c.height !== Math.round(h * dpr)) {
                c.width = Math.round(width * dpr); c.height = Math.round(h * dpr);
            }
            c.style.width = width + "px"; c.style.height = h + "px";
        }
        const X = (i: number) => data.pos[i] * width;

        // barra dos capítulos (altura = nº de versículos), livros alternando o tom
        const b = bars.getContext("2d")!;
        b.setTransform(dpr, 0, 0, dpr, 0, 0);
        b.clearRect(0, 0, width, barsH);
        const cw = width / data.nch, hmax = width * 0.035;
        let ci = 0;
        data.books.forEach((bk, bi) => {
            b.fillStyle = bi % 2 ? "#8a8a8a" : "#e6e6e6";
            for (const cnt of bk.chapters) { b.fillRect(ci * cw, 2, Math.max(cw * 0.8, 0.6), Math.max(1, (cnt / 176) * hmax)); ci++; }
        });
        b.fillStyle = "#8a8088"; b.font = `${Math.max(9, width / 140)}px Inter, system-ui, sans-serif`; b.textAlign = "center";
        ci = 0;
        let lastX = -Infinity;
        for (const bk of data.books) {
            const x = (ci + bk.chapters.length / 2) * cw;
            const w = b.measureText(bk.abbr).width;
            if (bk.chapters.length >= 12 && x - w / 2 > lastX + 4) { b.fillText(bk.abbr, x, hmax + width * 0.018); lastX = x + w / 2; }
            ci += bk.chapters.length;
        }
        const marks = view.kind === "theme" || view.kind === "pair" ? view.ids : [selected, hover?.i ?? -1].filter((i) => i >= 0);
        b.fillStyle = "#ffc24b";
        for (const i of marks) b.fillRect(X(i) - 1, 0, 2, hmax + 2);

        // arcos destacados por cima do fundo
        const ctx = fx.getContext("2d")!;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, fxH);
        ctx.globalCompositeOperation = "lighter";
        const arc = (a: number, z: number, style: string, lw: number) => {
            const xa = X(a), xb = X(z), r = Math.abs(xb - xa) / 2;
            if (r < 0.3) return;
            ctx.strokeStyle = style; ctx.lineWidth = lw;
            ctx.beginPath(); ctx.arc((xa + xb) / 2, baseY, r, Math.PI, 0); ctx.stroke();
        };
        if (view.kind === "pair") {
            arc(view.ids[0], view.ids[1], "rgba(255,210,110,0.35)", 7);
            arc(view.ids[0], view.ids[1], "rgba(255,235,180,1)", 2);
        } else if (view.kind === "theme") {
            const set = new Set(view.ids);
            for (const i of view.ids) for (const nb of neighbors(i)) if (set.has(nb.o) && nb.o > i) {
                arc(i, nb.o, "rgba(120,255,170,0.3)", 6); arc(i, nb.o, "rgba(200,255,220,1)", 1.8);
            }
        } else {
            const v = selected >= 0 ? selected : hover?.i ?? -1;
            if (v >= 0) {
                const nbs = v === selected ? list : neighbors(v);
                const a = Math.max(0.25, Math.min(0.9, 30 / Math.sqrt(nbs.length + 1) / 4));
                for (const nb of nbs) arc(v, nb.o, color(Math.sqrt(Math.abs(data.pos[nb.o] - data.pos[v])), a), 1.4);
                if (hoverLink >= 0) arc(v, hoverLink, "rgba(255,255,255,1)", 2.5);
            }
        }
    }, [data, width, view, selected, list, hover?.i, hoverLink, neighbors]);

    // ---------- ações ----------
    const showVerse = useCallback((i: number) => { setView({ kind: "verse", i }); setHoverLink(-1); }, []);

    const presets = useMemo<Record<string, () => void>>(() => ({
        "gn-jo": () => setView({ kind: "pair", ids: [parseRef("Gn 1:1"), parseRef("Jo 1:1")], title: "No princípio" }),
        "mc-is": () => setView({ kind: "pair", ids: [parseRef("Mc 1:3"), parseRef("Is 40:3")], title: "Voz que clama no deserto" }),
        is96: () => showVerse(parseRef("Is 9:6")),
        arvore: () => setView({ kind: "theme", ids: THEME_TREE.map(parseRef), title: "A árvore da vida" }),
        clear: () => { setView({ kind: "none" }); setHoverLink(-1); },
    }), [parseRef, showVerse]);

    useEffect(() => {
        if (!data) return;
        const fromHash = () => {
            const h = decodeURIComponent(location.hash.slice(1));
            if (presets[h]) presets[h]();
            else if (h) { const i = parseRef(h); if (i >= 0) showVerse(i); }
        };
        fromHash();
        window.addEventListener("hashchange", fromHash);
        return () => window.removeEventListener("hashchange", fromHash);
    }, [data, presets, parseRef, showVerse]);

    const verseAt = (px: number) => {
        if (!data) return -1;
        const t = px / width;
        let lo = 0, hi = data.nv - 1;
        while (lo < hi) { const m = (lo + hi) >> 1; if (data.pos[m] < t) lo = m + 1; else hi = m; }
        return lo > 0 && Math.abs(data.pos[lo - 1] - t) < Math.abs(data.pos[lo] - t) ? lo - 1 : lo;
    };

    const onMove = (e: React.MouseEvent) => {
        const r = stageRef.current!.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        setHover({ i: verseAt(x), x, y });
    };

    const onSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const i = parseRef(query);
        if (i >= 0) showVerse(i);
    };

    const focus = view.kind !== "none";
    const hoverText = hover ? text(hover.i) : undefined;
    const presetButtons: [string, string][] = [
        ["gn-jo", "Gn 1:1 → Jo 1:1"],
        ["mc-is", "Mc 1:3 → Is 40:3"],
        ["is96", "Isaías 9:6 (mais conectado)"],
        ["arvore", "A árvore da vida"],
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <form onSubmit={onSearch} className="flex w-full max-w-md gap-2">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Buscar versículo (ex.: Is 9:6, João 3:16)"
                        aria-label="Buscar versículo"
                    />
                    <Button type="submit" className="btn-primary h-10 shrink-0">
                        <SearchIcon className="mr-2 h-4 w-4" /> Ir
                    </Button>
                </form>
                <label className="flex items-center gap-3 text-sm text-muted-foreground">
                    Votos mín.
                    <input
                        type="range" min={-10} max={50} value={minVotes}
                        onChange={(e) => setMinVotes(+e.target.value)}
                        className="w-36 accent-brand-500"
                    />
                    <span className="w-6 tabular-nums text-foreground">{minVotes}</span>
                </label>
            </div>
            <div className="flex flex-wrap gap-2">
                {presetButtons.map(([key, label]) => (
                    <Button key={key} variant="subtle" size="sm" onClick={() => presets[key]()}>{label}</Button>
                ))}
                <Button variant="ghost" size="sm" onClick={() => presets.clear()}>Limpar</Button>
            </div>

            <div className="space-y-4">
                <div className="min-w-0 border border-ink/10 bg-black p-3 sm:p-5">
                    <div
                        ref={stageRef}
                        className="relative w-full cursor-crosshair"
                        onMouseMove={onMove}
                        onMouseLeave={() => setHover(null)}
                        onClick={() => hover && showVerse(hover.i)}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={BASE + "arcs_bg.jpg"}
                            alt="Todas as referências cruzadas da Bíblia em arcos, de Gênesis a Apocalipse"
                            className={cn("block w-full transition-opacity duration-300", focus && "opacity-30")}
                        />
                        <canvas ref={fxRef} className="pointer-events-none absolute left-0 top-0" />
                        <canvas ref={barsRef} className="block w-full" />
                        {!data && (
                            <div className="absolute inset-0 flex items-center justify-center text-sm text-cream/70">
                                Carregando 344.799 referências…
                            </div>
                        )}
                        {hover && data && (
                            <div
                                className="pointer-events-none absolute z-10 max-w-[320px] rounded-lg border border-cream/10 bg-ink/95 px-3 py-2 text-xs text-cream shadow-lg"
                                style={{ left: Math.min(hover.x + 14, width - 330), top: Math.max(0, hover.y - 90) }}
                            >
                                <b className="text-brand-300">{ref(hover.i)}</b> · {neighbors(hover.i).length} ligações
                                <p className="mt-1 leading-5 text-cream/80">
                                    {hoverText === undefined ? "carregando…" : hoverText.length > 200 ? hoverText.slice(0, 200) + "…" : hoverText}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {view.kind !== "none" && (
                <aside className="min-w-0 max-h-[60vh] overflow-auto rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4">
                    {view.kind === "verse" && (
                        <>
                            <h3 className="text-lg font-bold text-brand-700">{ref(view.i)}</h3>
                            <p className="mt-1 text-sm leading-6 text-foreground">{text(view.i) ?? "carregando…"}</p>
                            <p className="mt-3 text-xs text-muted-foreground">
                                {list.length} ligações{minVotes > -10 ? ` (votos ≥ ${minVotes})` : ""}
                            </p>
                            <ol className="mt-2">
                                {list.slice(0, 400).map((nb) => {
                                    const end = data && data.from[nb.l] === view.i ? data.span[nb.l] : 0;
                                    return (
                                        <li
                                            key={nb.o}
                                            className="cursor-pointer border-t border-foreground/10 px-1 py-2 text-[13px] leading-5 hover:bg-brand-50"
                                            onMouseEnter={() => setHoverLink(nb.o)}
                                            onMouseLeave={() => setHoverLink(-1)}
                                            onClick={() => showVerse(nb.o)}
                                        >
                                            <span className="float-right text-xs text-muted-foreground">{nb.votes} votos</span>
                                            <span className="mr-1.5 font-semibold text-brand-700">
                                                {ref(nb.o)}{end > 0 && data ? `–${data.verse[nb.o] + end}` : ""}
                                            </span>
                                            {text(nb.o) ?? "…"}
                                        </li>
                                    );
                                })}
                            </ol>
                        </>
                    )}
                    {(view.kind === "pair" || view.kind === "theme") && (
                        <>
                            <h3 className="text-lg font-bold text-brand-700">{view.title}</h3>
                            <div className="mt-3 space-y-3">
                                {view.ids.map((i) => (
                                    <div key={i} className="border-l-2 border-brand-400 pl-3 text-sm leading-6">
                                        <b className="text-foreground">{ref(i)}</b>
                                        <p className="text-muted-foreground">{text(i) ?? "carregando…"}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </aside>
                )}
            </div>
        </div>
    );
}
