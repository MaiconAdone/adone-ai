"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { captureAttribution } from "@/lib/attribution";
import { analyticsEnabled, GA4_ID, getConsent, GOOGLE_ADS_ID, LINKEDIN_PARTNER_ID, setConsent, trackConversion } from "@/lib/analytics";
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

// LinkedIn não tem modo de consentimento: a Insight Tag só é carregada depois do "Aceitar"
const linkedinScript = `
window._linkedin_partner_id = "${LINKEDIN_PARTNER_ID}";
window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
window._linkedin_data_partner_ids.push(window._linkedin_partner_id);
(function(l){ if (!l) { window.lintrk = function(a,b){ window.lintrk.q.push([a,b]) }; window.lintrk.q = []; }
var s = document.getElementsByTagName("script")[0]; var b = document.createElement("script");
b.type = "text/javascript"; b.async = true; b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
s.parentNode.insertBefore(b, s); })(window.lintrk);
`;

export function Analytics() {
    const [showBanner, setShowBanner] = useState(false);
    const [marketingConsent, setMarketingConsent] = useState(false);

    useEffect(() => {
        captureAttribution();
        const consent = getConsent();
        if (analyticsEnabled && consent === null) setShowBanner(true);
        setMarketingConsent(consent === "granted");

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
        setMarketingConsent(choice === "granted");
        setShowBanner(false);
    };

    return (
        <>
            {LINKEDIN_PARTNER_ID && marketingConsent && (
                <Script id="linkedin-insight" strategy="afterInteractive">{linkedinScript}</Script>
            )}

            {(GA4_ID || GOOGLE_ADS_ID) && (
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
