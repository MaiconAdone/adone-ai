// CRM — Integração HubSpot
// Cria/atualiza contatos automaticamente quando Vick qualifica um lead

import axios from "axios";

const HUBSPOT_BASE = "https://api.hubapi.com";

function headers() {
    return {
        Authorization: `Bearer ${process.env.HUBSPOT_API_KEY}`,
        "Content-Type": "application/json",
    };
}

export interface LeadContact {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    sector?: string;
    companySize?: string;
    score?: number;
    source?: "whatsapp" | "site";
    notes?: string;
}

// Cria ou atualiza contato no HubSpot
export async function upsertContact(lead: LeadContact): Promise<string | null> {
    if (!process.env.HUBSPOT_API_KEY) {
        console.log("[HubSpot] API Key não configurada");
        return null;
    }

    const [firstname, ...rest] = lead.name.trim().split(" ");
    const lastname = rest.join(" ") || "";

    const properties: Record<string, string> = {
        firstname,
        lastname,
        company: lead.company || "",
        phone: lead.phone || "",
        hs_lead_status: lead.score && lead.score >= 70 ? "IN_PROGRESS" : "NEW",
        lifecyclestage: "lead",
        lead_source: lead.source === "whatsapp" ? "SOCIAL_MEDIA" : "WEBSITE",
    };

    if (lead.email) properties.email = lead.email;
    if (lead.sector) properties.industry = lead.sector;
    if (lead.notes) properties.notes_last_contacted = lead.notes;
    if (lead.score) properties.hubspotscore = String(lead.score);

    try {
        // Tentar criar contato
        if (lead.email) {
            // Buscar se já existe
            const search = await axios.post(
                `${HUBSPOT_BASE}/crm/v3/objects/contacts/search`,
                { filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: lead.email }] }] },
                { headers: headers() }
            );

            if (search.data.total > 0) {
                // Atualizar existente
                const id = search.data.results[0].id;
                await axios.patch(
                    `${HUBSPOT_BASE}/crm/v3/objects/contacts/${id}`,
                    { properties },
                    { headers: headers() }
                );
                console.log(`[HubSpot] Contato atualizado: ${lead.name} (${id})`);
                return id;
            }
        }

        // Criar novo
        const res = await axios.post(
            `${HUBSPOT_BASE}/crm/v3/objects/contacts`,
            { properties },
            { headers: headers() }
        );
        console.log(`[HubSpot] Contato criado: ${lead.name} (${res.data.id})`);
        return res.data.id;
    } catch (err: any) {
        console.error("[HubSpot] Erro:", err?.response?.data || err.message);
        return null;
    }
}

// Adicionar nota ao contato
export async function addNote(contactId: string, note: string): Promise<void> {
    if (!process.env.HUBSPOT_API_KEY) return;

    try {
        await axios.post(
            `${HUBSPOT_BASE}/crm/v3/objects/notes`,
            {
                properties: {
                    hs_note_body: note,
                    hs_timestamp: new Date().toISOString(),
                },
                associations: [{
                    to: { id: contactId },
                    types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }],
                }],
            },
            { headers: headers() }
        );
    } catch (err: any) {
        console.error("[HubSpot] Erro ao adicionar nota:", err?.response?.data || err.message);
    }
}
