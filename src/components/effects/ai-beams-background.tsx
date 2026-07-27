export function AiBeamsBackground() {
    return (
        <div aria-hidden="true" className="ai-beams pointer-events-none absolute inset-0 z-[1] overflow-hidden">
            <svg className="absolute inset-0 size-full" viewBox="0 0 1000 760" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="adone-beam" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#8b5cf6" stopOpacity="0" />
                        <stop offset=".5" stopColor="#a78bfa" stopOpacity=".9" />
                        <stop offset="1" stopColor="#6366f1" stopOpacity="0" />
                    </linearGradient>
                    <filter id="adone-beam-glow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <path className="ai-beam-path ai-beam-path-1" d="M-60 570 C180 410 250 440 410 300 S720 105 1060 170" />
                <path className="ai-beam-path ai-beam-path-2" d="M-80 210 C170 310 300 150 480 290 S760 560 1080 430" />
                <path className="ai-beam-path ai-beam-path-3" d="M80 800 C240 590 420 640 535 470 S720 235 940 -40" />

                <g className="ai-signal-node ai-signal-node-1">
                    <circle r="9" fill="#8b5cf6" fillOpacity=".15" />
                    <circle r="3" fill="#c4b5fd" />
                </g>
                <g className="ai-signal-node ai-signal-node-2">
                    <circle r="9" fill="#6366f1" fillOpacity=".15" />
                    <circle r="3" fill="#a5b4fc" />
                </g>
                <g className="ai-signal-node ai-signal-node-3">
                    <circle r="8" fill="#a855f7" fillOpacity=".14" />
                    <circle r="2.5" fill="#e9d5ff" />
                </g>
            </svg>

            <div className="ai-scan-line" />
            <div className="ai-hud-corner ai-hud-corner-left" />
            <div className="ai-hud-corner ai-hud-corner-right" />
        </div>
    );
}
