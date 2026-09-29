"use client";

import { cn } from "@/functions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useEffect, useRef, useState } from "react";

interface Props {
    src: string;
    mobileSrc?: string;
    poster: string;
    className?: string;
    // Enquadramento do vídeo/pôster dentro do bloco (ex.: deslocar a pessoa para a direita)
    mediaClassName?: string;
}

// Vídeo decorativo em loop; mostra só o pôster para quem prefere menos movimento
export function BackgroundVideo({ src, mobileSrc, poster, className, mediaClassName }: Props) {
    const reduceMotion = useReducedMotion();
    const [isSmallScreen, setIsSmallScreen] = useState<boolean | null>(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const updateScreen = () => setIsSmallScreen(mediaQuery.matches);
        updateScreen();
        mediaQuery.addEventListener("change", updateScreen);
        return () => mediaQuery.removeEventListener("change", updateScreen);
    }, []);

    // Até saber o tamanho da tela, só o pôster (evita baixar o vídeo errado)
    const showVideo = !reduceMotion && isSmallScreen !== null;
    const videoSrc = isSmallScreen && mobileSrc ? mobileSrc : src;

    const videoRef = useRef<HTMLVideoElement>(null);

    // O React não escreve o atributo "muted" no HTML, e sem ele o Safari do iPhone bloqueia o autoplay.
    // Se o play automático ainda for recusado (ex.: modo pouca energia), tenta de novo no primeiro toque.
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.muted = true;
        video.setAttribute("muted", "");
        const tryPlay = () => { video.play().catch(() => {}); };
        tryPlay();
        const events = ["touchstart", "click", "scroll"] as const;
        const onInteract = () => {
            tryPlay();
            events.forEach(e => window.removeEventListener(e, onInteract));
        };
        events.forEach(e => window.addEventListener(e, onInteract, { passive: true }));
        // Ao voltar para a aba o celular costuma deixar o vídeo pausado
        const onVisible = () => { if (document.visibilityState === "visible") tryPlay(); };
        document.addEventListener("visibilitychange", onVisible);
        return () => {
            events.forEach(e => window.removeEventListener(e, onInteract));
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [showVideo, videoSrc]);

    return (
        <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
            {showVideo ? (
                <video
                    key={videoSrc}
                    ref={videoRef}
                    className={cn("h-full w-full object-cover", mediaClassName)}
                    src={videoSrc}
                    poster={poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                />
            ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={poster} alt="" className={cn("h-full w-full object-cover", mediaClassName)} />
            )}
        </div>
    );
}
