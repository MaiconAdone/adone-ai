import { cn } from "@/functions";

export function DataFlowLines({ className }: { className?: string }) {
    return (
        <div aria-hidden="true" className={cn("data-flow-lines pointer-events-none absolute inset-0 overflow-hidden", className)}>
            {[18, 40, 62, 84].map((top, index) => (
                <span
                    key={top}
                    className="data-flow-line"
                    style={{ top: `${top}%`, animationDelay: `${index * -1.4}s` }}
                />
            ))}
        </div>
    );
}
