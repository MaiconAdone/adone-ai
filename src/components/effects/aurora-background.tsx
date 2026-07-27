import { cn } from "@/functions";

export function AuroraBackground({ className }: { className?: string }) {
    return (
        <div
            aria-hidden="true"
            className={cn("aurora-background pointer-events-none absolute inset-0 overflow-hidden", className)}
        >
            <div className="aurora-orb aurora-orb-primary" />
            <div className="aurora-orb aurora-orb-secondary" />
        </div>
    );
}
