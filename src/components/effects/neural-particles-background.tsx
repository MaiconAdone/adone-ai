"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useEffect, useState } from "react";

const initializeParticles = async (engine: Parameters<typeof loadSlim>[0]) => {
    await loadSlim(engine);
};

export function NeuralParticlesBackground() {
    const [isSmallScreen, setIsSmallScreen] = useState(true);
    const reduceMotion = useReducedMotion();

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const updateScreen = () => setIsSmallScreen(mediaQuery.matches);
        updateScreen();
        mediaQuery.addEventListener("change", updateScreen);
        return () => mediaQuery.removeEventListener("change", updateScreen);
    }, []);

    if (reduceMotion) return null;

    return (
        <ParticlesProvider init={initializeParticles}>
            <Particles
                id="adone-neural-network"
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-0"
                options={{
                fullScreen: { enable: false },
                fpsLimit: 45,
                detectRetina: true,
                pauseOnBlur: true,
                pauseOnOutsideViewport: true,
                background: { color: { value: "transparent" } },
                particles: {
                    color: { value: ["#8b5cf6", "#a78bfa", "#64748b"] },
                    links: {
                        enable: !isSmallScreen,
                        color: "#8b5cf6",
                        distance: 145,
                        opacity: 0.11,
                        width: 0.7,
                    },
                    move: {
                        enable: true,
                        speed: isSmallScreen ? 0.18 : 0.35,
                        direction: "none",
                        outModes: { default: "bounce" },
                    },
                    number: {
                        value: isSmallScreen ? 18 : 42,
                        density: { enable: true, width: 900, height: 600 },
                    },
                    opacity: { value: { min: 0.12, max: 0.38 } },
                    size: { value: { min: 0.8, max: 2.2 } },
                },
                interactivity: {
                    detectsOn: "window",
                    events: {
                        onHover: { enable: !isSmallScreen, mode: "grab" },
                        resize: { enable: true },
                    },
                    modes: {
                        grab: { distance: 120, links: { opacity: 0.2 } },
                    },
                },
                }}
            />
        </ParticlesProvider>
    );
}
