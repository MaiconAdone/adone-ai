"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Theme = "claro" | "escuro";

export function HeroVideo() {
    const { resolvedTheme } = useTheme();
    const reduceMotion = useReducedMotion();
    const [mounted, setMounted] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const updateScreen = () => setIsSmallScreen(mediaQuery.matches);
        updateScreen();
        setMounted(true);
        mediaQuery.addEventListener("change", updateScreen);
        return () => mediaQuery.removeEventListener("change", updateScreen);
    }, []);

    // O tema só é conhecido no cliente; até lá, nada é baixado
    if (!mounted) return null;

    const theme: Theme = resolvedTheme === "light" ? "claro" : "escuro";
    const poster = `/videos/${theme}-poster.webp`;
    const src = `/videos/${theme}${isSmallScreen ? "-mobile" : ""}.mp4`;

    return (
        // No celular o card é alto e estreito: o vídeo (retrato) cobre só o topo e se dissolve no fim
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[760px] overflow-hidden [mask-image:linear-gradient(to_bottom,black_70%,transparent)] md:inset-0 md:h-auto md:[mask-image:none]">
            {reduceMotion ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={poster} alt="" className="h-full w-full object-cover" />
            ) : (
                <video
                    key={src}
                    className="h-full w-full object-cover"
                    src={src}
                    poster={poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                />
            )}
            {/* Camadas para manter o texto legível sobre o vídeo */}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,15,0.84)_0%,rgba(9,8,15,0.74)_45%,rgba(9,8,15,0.92)_100%)] light:bg-[linear-gradient(180deg,rgba(250,249,254,0.55)_0%,rgba(250,249,254,0.35)_45%,rgba(250,249,254,0.7)_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(124,58,237,0.18),transparent_60%)]" />
            {/* Tema claro: clarão suave só atrás do texto, mantendo as bordas do vídeo nítidas */}
            <div className="absolute inset-0 hidden light:block bg-[radial-gradient(ellipse_85%_45%_at_50%_45%,rgba(250,249,254,0.85)_0%,rgba(250,249,254,0.6)_55%,transparent_100%)] md:bg-[radial-gradient(ellipse_48%_42%_at_50%_38%,rgba(250,249,254,0.82)_0%,rgba(250,249,254,0.55)_55%,transparent_100%)]" />
        </div>
    );
}
