"use client";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

interface AnimatedCounterProps {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    locale?: string;
}

export function AnimatedCounter({
    value,
    prefix = "",
    suffix = "",
    duration = 1.6,
    locale = "pt-BR",
}: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const reduceMotion = useReducedMotion();
    const count = useMotionValue(reduceMotion ? value : 0);
    const rounded = useTransform(count, (latest) =>
        `${prefix}${Math.round(latest).toLocaleString(locale)}${suffix}`
    );

    useEffect(() => {
        if (!inView || reduceMotion) {
            count.set(value);
            return;
        }

        const controls = animate(count, value, {
            duration,
            ease: [0.22, 1, 0.36, 1],
        });

        return controls.stop;
    }, [count, duration, inView, reduceMotion, value]);

    return <motion.span ref={ref}>{rounded}</motion.span>;
}
