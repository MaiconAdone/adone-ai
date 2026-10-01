// Roda antes do build (npm "prebuild").
// Algumas hospedagens (ex.: Hostinger) só expõem as variáveis de ambiente durante o build.
// Este script grava as variáveis de servidor em .runtime-env.json, lido na inicialização do
// servidor por src/instrumentation.ts. O arquivo fica só no servidor (está no .gitignore) e não
// vai para o navegador. JSON preserva qualquer caractere (o formato .env interpreta "$" e aspas).

import { writeFileSync } from "node:fs";

const SERVER_VARS = [
    "SITE_URL",
    "OPENAI_API_KEY",
    "OPENAI_MODEL",
    "BOOKING_URL",
    "WEBHOOK_SECRET",
    "ZAPI_INSTANCE",
    "ZAPI_TOKEN",
    "ZAPI_CLIENT_TOKEN",
    "ZAPI_WEBHOOK_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_REFRESH_TOKEN",
    "GOOGLE_SHEET_ID",
    "GOOGLE_CALENDAR_ID",
    "GOOGLE_BUSY_CALENDARS",
    "MARKETING_AGENTS_ENABLED",
    "MARKETING_NOTIFY_PHONE",
    "MARKETING_STRATEGY_MODEL",
    "MARKETING_CONTENT_MODEL",
    "MARKETING_ARTICLES_PER_RUN",
    "MARKETING_IMAGE_MODEL",
    "MARKETING_PUBLISH_DELAY_HOURS",
    "GOOGLE_DRIVE_FOLDER_ID",
    "GA4_PROPERTY_ID",
    "PAINEL_PASSWORD",
    "EMAIL_HOST",
    "EMAIL_PORT",
    "EMAIL_SECURE",
    "EMAIL_USER",
    "EMAIL_PASS",
    "RECIPIENT_EMAIL",
    "RECIPIENT_NAME",
    "LINKEDIN_CLIENT_ID",
    "LINKEDIN_CLIENT_SECRET",
    "LINKEDIN_ACCESS_TOKEN",
    "LINKEDIN_MEMBER_ID",
    "LINKEDIN_ORG_ID",
    "LINKEDIN_PAGE_CLIENT_ID",
    "LINKEDIN_PAGE_CLIENT_SECRET",
    "LINKEDIN_ADS_CLIENT_ID",
    "LINKEDIN_ADS_CLIENT_SECRET",
    "LINKEDIN_AD_ACCOUNT_ID",
    "LINKEDIN_API_VERSION",
    "GOOGLE_ADS_DEVELOPER_TOKEN",
    "GOOGLE_ADS_CUSTOMER_ID",
    "GOOGLE_ADS_LOGIN_CUSTOMER_ID",
    "GOOGLE_ADS_API_VERSION",
];

const present = SERVER_VARS.filter((name) => process.env[name]);

// Sem variáveis no ambiente (ex.: build local, que usa .env.local): não cria nem sobrescreve nada
if (present.length === 0) {
    console.log("[runtime-env] Nenhuma variável de servidor no ambiente de build; nada a gravar.");
    process.exit(0);
}

const values = Object.fromEntries(present.map((name) => [name, process.env[name]]));
writeFileSync(".runtime-env.json", JSON.stringify(values), { mode: 0o600 });

console.log(`[runtime-env] ${present.length} variáveis gravadas em .runtime-env.json: ${present.join(", ")}`);
