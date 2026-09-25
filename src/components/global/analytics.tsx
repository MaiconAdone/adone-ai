"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { captureAttribution } from "@/lib/attribution";
import { analyticsEnabled, GA4_ID, getConsent, GOOGLE_ADS_ID, setConsent, trackConversion } from "@/lib/analytics";
import { Button } from "../ui/button";

// Consent Mode: tudo negado até o visitante aceitar; escolha anterior reaplicada antes de configurar as tags
const initScript = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
try { if (localStorage.getItem('adone_consent') === 'granted') gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' }); } catch (e) {}
gtag('js', new Date());
${GA4_ID ? `gtag('config', '${GA4_ID}');` : ""}
${GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : ""}
`;

export function Analytics() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        captureAttribution();
        if (analyticsEnabled && getConsent() === null) setShowBanner(true);

        // Qualquer link de WhatsApp do site conta como conversão de contato
        const onClick = (event: MouseEvent) => {
            const link = (event.target as HTMLElement | null)?.closest?.("a[href*='wa.me']");
            if (link) trackConversion("whatsapp", { page: window.location.pathname });
        };
        document.addEventListener("click", onClick, { capture: true });
        return () => document.removeEventListener("click", onClick, { capture: true });
    }, []);

    const choose = (choice: "granted" | "denied") => {
        setConsent(choice);
        setShowBanner(false);
    };

    return (
        <>
            {analyticsEnabled && (
                <>
                    <Script id="gtag-init" strategy="afterInteractive">{initScript}</Script>
                    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID || GOOGLE_ADS_ID}`} strategy="afterInteractive" />
                </>
            )}

            {showBanner && (
                <div
                    role="dialog"
                    aria-label="Preferências de cookies"
                    className="fixed bottom-4 left-4 right-24 z-[60] md:right-auto md:max-w-md rounded-2xl border border-foreground/10 bg-background/95 backdrop-blur-lg p-4 shadow-2xl"
                >
                    <p className="text-sm text-foreground font-medium">Cookies e medição</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        Usamos cookies do Google para medir visitas e o desempenho dos nossos anúncios. Você pode aceitar ou recusar — o site funciona igual.{" "}
                        <Link href="/privacidade" className="underline hover:text-foreground">Política de privacidade</Link>
                    </p>
                    <div className="flex gap-2 mt-3">
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white" onClick={() => choose("granted")}>
                            Aceitar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => choose("denied")}>
                            Recusar
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}
