import { cn } from "@/functions";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

interface TechButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean;
}

export const TechButton = React.forwardRef<HTMLButtonElement, TechButtonProps>(
    ({ asChild = false, className, children, ...props }, ref) => {
        const Component = asChild ? Slot : "button";

        return (
            <Component
                ref={ref}
                className={cn(
                    "tech-button relative inline-flex h-12 items-center justify-center overflow-hidden rounded-lg px-8 text-sm font-semibold text-white",
                    "bg-violet-600 shadow-[0_10px_35px_-12px_rgba(124,58,237,0.8)] transition-[transform,box-shadow,background-color] duration-300",
                    "hover:-translate-y-0.5 hover:bg-violet-500 hover:shadow-[0_14px_42px_-10px_rgba(139,92,246,0.75)] active:translate-y-0 active:scale-[0.98]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    "disabled:pointer-events-none disabled:opacity-50",
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

TechButton.displayName = "TechButton";
