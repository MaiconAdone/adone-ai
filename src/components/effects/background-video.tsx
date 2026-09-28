"use client";

import { cn } from "@/functions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useEffect, useState } from "react";

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

    return (
        <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
            {showVideo ? (
                <video
                    key={videoSrc}
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
