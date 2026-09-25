"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/functions";
import { Button } from "../ui/button";

interface Props {
    className?: string;
}

const ThemeToggle = ({ className }: Props) => {
    const { resolvedTheme, setTheme } = useTheme();

    // Os ícones são trocados via CSS (classe .light no <html>), evitando divergência de hidratação
    return (
        <Button
            size="icon"
            variant="ghost"
            onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
            aria-label="Alternar entre tema claro e escuro"
            title="Alternar tema"
            className={cn("w-8 h-8 p-2", className)}
        >
            <SunIcon className="w-4 h-4 light:hidden" />
            <MoonIcon className="w-4 h-4 hidden light:block" />
        </Button>
    );
};

export default ThemeToggle
