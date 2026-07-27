import { cn } from "@/functions";
import { RevealSection } from "../motion/reveal-section";

interface Props {
    className?: string;
    children: React.ReactNode;
    delay?: number;
    reverse?: boolean;
    simple?: boolean;
}

const Container = ({ children, className, delay = 0.2, reverse, simple }: Props) => {
    return (
        <RevealSection
            className={cn("w-full h-full", className)}
            delay={delay}
            direction={reverse ? "down" : "up"}
            duration={simple ? 0.25 : 0.55}
        >
            {children}
        </RevealSection>
    )
};

export default Container
