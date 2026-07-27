"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const reduceMotion = useReducedMotion();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: reduceMotion ? 1000 : 140,
        damping: reduceMotion ? 100 : 28,
        restDelta: 0.001,
    });

    return (
        <motion.div
            aria-hidden="true"
            className="fixed inset-x-0 top-0 z-[100] h-0.5 origin-left bg-gradient-to-r from-violet-500 via-purple-400 to-indigo-400 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
            style={{ scaleX }}
        />
    );
}
