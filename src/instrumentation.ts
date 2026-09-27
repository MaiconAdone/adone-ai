// Executado uma vez quando o servidor Next.js inicia
export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs") {
        const { loadRuntimeEnv } = await import("./lib/runtime-env");
        loadRuntimeEnv();

        // Rotinas semanais dos agentes de marketing (só em produção com MARKETING_AGENTS_ENABLED=true)
        const { startMarketingScheduler } = await import("./lib/engine/marketing/scheduler");
        startMarketingScheduler();
    }
}
