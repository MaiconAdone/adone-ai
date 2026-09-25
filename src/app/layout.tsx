import "@/styles/globals.css";
import { cn, generateMetadata } from "@/functions";
import { inter, satoshi, spaceGrotesk } from "@/constants";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components";
import { Analytics } from "@/components/global/analytics";

export const metadata = generateMetadata();

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" suppressHydrationWarning>
            <body
                className={cn(
                    "min-h-screen bg-background text-foreground antialiased font-default overflow-x-hidden !scrollbar-hide",
                    inter.variable,
                    satoshi.variable,
                    spaceGrotesk.variable,
                )}
            >
                <Providers>
                    <Toaster
                        richColors
                        position="top-right"
                    />
                    {children}
                    <Analytics />
                </Providers>
            </body>
        </html>
    );
};
