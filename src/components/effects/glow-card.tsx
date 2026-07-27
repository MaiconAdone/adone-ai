"use client";

import { cn } from "@/functions";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useRef } from "react";

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export function GlowCard({ children, className, ...props }: GlowCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
        if (reduceMotion || event.pointerType === "touch" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateX = ((y / rect.height) - 0.5) * -2.5;
        const rotateY = ((x / rect.width) - 0.5) * 2.5;

        ref.current.style.setProperty("--glow-x", `${x}px`);
        ref.current.style.setProperty("--glow-y", `${y}px`);
        ref.current.style.setProperty("--rotate-x", `${rotateX}deg`);
        ref.current.style.setProperty("--rotate-y", `${rotateY}deg`);
    };

    const resetTilt = () => {
        ref.current?.style.setProperty("--rotate-x", "0deg");
        ref.current?.style.setProperty("--rotate-y", "0deg");
    };

    return (
        <div
            ref={ref}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
            className={cn("glow-card relative overflow-hidden rounded-2xl", className)}
            {...props}
        >
            {children}
        </div>
    );
}
