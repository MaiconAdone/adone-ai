// Executado uma vez quando o servidor Next.js inicia
export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { loadRuntimeEnv } = await import("./lib/runtime-env");
        loadRuntimeEnv();

        // Rotinas semanais dos agentes de marketing (só em produção com MARKETING_AGENTS_ENABLED=true)
        const { startMarketingScheduler } = await import("./lib/engine/marketing/scheduler");
        startMarketingScheduler();

        // Avisa por e-mail quando o WhatsApp da Vick cai (só em produção, com Z-API configurada)
        const { startWhatsAppMonitor } = await import("./lib/engine/chatbot/whatsapp-monitor");
        startWhatsAppMonitor();
    }
}
