import { cn } from "@/functions";
import Container from "../global/container";
import { SectionBadge } from "../ui/section-bade";

interface Props {
    badge: string;
    title: React.ReactNode;
    description?: React.ReactNode;
    align?: "center" | "left";
    className?: string;
    dark?: boolean;
}

// Cabeçalho padrão das seções: rótulo, título e texto de apoio
export const SectionHeader = ({ badge, title, description, align = "center", className, dark }: Props) => {
    return (
        <Container>
            <div className={cn(
                "flex flex-col max-w-2xl",
                align === "center" ? "items-center text-center mx-auto" : "items-start text-left",
                className
            )}>
                <SectionBadge title={badge} />
                <h2 className={cn(
                    "mt-5 font-heading text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight !leading-[1.12]",
                    dark ? "text-white" : "text-foreground"
                )}>
                    {title}
                </h2>
                {description && (
                    <p className={cn(
                        "mt-5 text-base md:text-lg leading-relaxed",
                        dark ? "text-cream/75" : "text-muted-foreground"
                    )}>
                        {description}
                    </p>
                )}
            </div>
        </Container>
    );
};

// Destaque de palavras no título (verde-água escuro no claro, verde-água da logo no escuro)
export const Highlight = ({ children, dark }: { children: React.ReactNode; dark?: boolean }) => (
    <span className={dark ? "text-brand-400" : "text-brand-700"}>{children}</span>
);
