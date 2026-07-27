"use client";

import { cn } from "@/functions";
import { motion, useReducedMotion } from "framer-motion";

interface RevealSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "none";
    duration?: number;
}

export function RevealSection({
    children,
    className,
    delay = 0,
    direction = "up",
    duration = 0.55,
}: RevealSectionProps) {
    const reduceMotion = useReducedMotion();
    const offset = direction === "none" ? 0 : direction === "down" ? -18 : 18;

    return (
        <motion.div
            className={cn("w-full", className)}
            initial={reduceMotion ? false : { opacity: 0, y: offset }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}
