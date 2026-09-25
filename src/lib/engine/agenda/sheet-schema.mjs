// Estrutura da planilha "Adone — Leads e Agendamentos"
// Compartilhada entre o script de autorização (cria a planilha) e o site (grava as linhas).

export const LEADS_SHEET = "Leads";
export const BOOKINGS_SHEET = "Agendamentos";

// Origem do visitante (ver src/lib/attribution.ts), no fim das duas abas
export const ATTRIBUTION_HEADERS = [
    "UTM source",
    "UTM medium",
    "UTM campaign",
    "UTM term",
    "UTM content",
    "gclid",
    "Página de entrada",
    "Referência",
];

export const LEADS_HEADERS = [
    "Data",
    "Canal",
    "Nome",
    "Empresa",
    "Setor",
    "Telefone",
    "E-mail",
    "Desafio / mensagem",
    "Tem dados",
    "Urgência",
    "Orçamento",
    "Porte",
    "Interesse",
    "Score",
    "Qualificado",
    ...ATTRIBUTION_HEADERS,
];

export const BOOKINGS_HEADERS = [
    "Criado em",
    "Data da reunião",
    "Horário",
    "Nome",
    "E-mail",
    "WhatsApp",
    "Empresa",
    "Origem",
    "Observações",
    "Link do Meet",
    "ID do evento",
    ...ATTRIBUTION_HEADERS,
];
