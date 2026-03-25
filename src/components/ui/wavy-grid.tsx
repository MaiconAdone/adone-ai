"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/functions";

interface Props {
    className?: string;
    color?: string;
    spacing?: number;
    amplitude?: number;
    speed?: number;
}

export default function WavyGrid({
    className,
    color = "rgba(139, 92, 246, 0.18)",
    spacing = 44,
    amplitude = 7,
    speed = 0.008,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const timeRef = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth * window.devicePixelRatio;
            canvas.height = canvas.offsetHeight * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        };
        resize();
        window.addEventListener("resize", resize);

        const draw = () => {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            const t = timeRef.current;

            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.8;

            // Horizontal wavy lines
            for (let row = -1; row <= Math.ceil(h / spacing) + 1; row++) {
                const baseY = row * spacing;
                ctx.beginPath();
                for (let x = 0; x <= w; x += 3) {
                    const wave = Math.sin((x / w) * Math.PI * 3 + t + row * 0.4) * amplitude;
                    if (x === 0) ctx.moveTo(x, baseY + wave);
                    else ctx.lineTo(x, baseY + wave);
                }
                ctx.stroke();
            }

            // Vertical wavy lines
            for (let col = -1; col <= Math.ceil(w / spacing) + 1; col++) {
                const baseX = col * spacing;
                ctx.beginPath();
                for (let y = 0; y <= h; y += 3) {
                    const wave = Math.sin((y / h) * Math.PI * 3 + t + col * 0.4) * amplitude;
                    if (y === 0) ctx.moveTo(baseX + wave, y);
                    else ctx.lineTo(baseX + wave, y);
                }
                ctx.stroke();
            }

            timeRef.current += speed;
            animRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animRef.current);
        };
    }, [color, spacing, amplitude, speed]);

    return (
        <canvas
            ref={canvasRef}
            className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
        />
    );
}
