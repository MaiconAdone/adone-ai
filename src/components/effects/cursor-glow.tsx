"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorGlow() {
    const reduceMotion = useReducedMotion();
    const [enabled, setEnabled] = useState(false);
    const x = useMotionValue(-200);
    const y = useMotionValue(-200);
    const smoothX = useSpring(x, { stiffness: 180, damping: 30, mass: 0.4 });
    const smoothY = useSpring(y, { stiffness: 180, damping: 30, mass: 0.4 });

    useEffect(() => {
        const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
        const updateEnabled = () => setEnabled(finePointer.matches && !reduceMotion);
        const updatePointer = (event: PointerEvent) => {
            x.set(event.clientX - 160);
            y.set(event.clientY - 160);
        };

        updateEnabled();
        finePointer.addEventListener("change", updateEnabled);
        window.addEventListener("pointermove", updatePointer, { passive: true });

        return () => {
            finePointer.removeEventListener("change", updateEnabled);
            window.removeEventListener("pointermove", updatePointer);
        };
    }, [reduceMotion, x, y]);

    if (!enabled) return null;

    return (
        <motion.div
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-[60] h-80 w-80 rounded-full bg-violet-500/[0.045] blur-3xl"
            style={{ x: smoothX, y: smoothY }}
        />
    );
}
