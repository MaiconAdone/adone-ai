// LinkedIn Auto-Poster — Adone Intelligence
// Posta automaticamente na página da empresa ou perfil pessoal

import axios from "axios";

const LINKEDIN_API = "https://api.linkedin.com/v2";
const LINKEDIN_REST  = "https://api.linkedin.com/rest";

// Buscar o ID do usuário autenticado
export async function getMemberId(token: string): Promise<string | null> {
    try {
        const res = await axios.get(`${LINKEDIN_API}/userinfo`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.sub; // OpenID Connect user ID
    } catch (err: any) {
        console.error("[LinkedIn] Erro ao buscar memberId:", err?.response?.data || err.message);
        return null;
    }
}

// Postar no LinkedIn via nova API /rest/posts (substitui ugcPosts deprecado)
export async function postToLinkedIn(text: string): Promise<string | null> {
    const token    = process.env.LINKEDIN_ACCESS_TOKEN;
    const memberId = process.env.LINKEDIN_MEMBER_ID;
    const orgId    = process.env.LINKEDIN_ORG_ID;

    if (!token) {
        console.log("[LinkedIn] LINKEDIN_ACCESS_TOKEN não configurado");
        return null;
    }

    // Preferir página da empresa; fallback para perfil pessoal
    const author = orgId
        ? `urn:li:organization:${orgId}`
        : `urn:li:person:${memberId}`;

    if (!orgId && !memberId) {
        console.log("[LinkedIn] LINKEDIN_ORG_ID ou LINKEDIN_MEMBER_ID necessário");
        return null;
    }

    const authorsToTry = orgId
        ? [`urn:li:organization:${orgId}`, `urn:li:person:${memberId}`]
        : [`urn:li:person:${memberId}`];

    for (const authorUrn of authorsToTry) {
        console.log(`[LinkedIn] Tentando postar como: ${authorUrn}`);
        try {
            const res = await axios.post(
                `${LINKEDIN_REST}/posts`,
                {
                    author: authorUrn,
                    commentary: text,
                    visibility: "PUBLIC",
                    distribution: {
                        feedDistribution: "MAIN_FEED",
                        targetEntities: [],
                        thirdPartyDistributionChannels: [],
                    },
                    lifecycleState: "PUBLISHED",
                    isReshareDisabledByAuthor: false,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "LinkedIn-Version": "202401",
                        "X-Restli-Protocol-Version": "2.0.0",
                    },
                }
            );

            const postId = res.headers["x-restli-id"] || res.data?.id;
            console.log(`[LinkedIn] Post publicado como ${authorUrn}: ${postId}`);
            return postId || "published";
        } catch (err: any) {
            console.error(`[LinkedIn] Falhou com ${authorUrn}:`, err?.response?.data || err.message);
            // tenta próximo author (fallback para perfil pessoal)
        }
    }

    return null;
}

// Buscar organização ID pelo token
export async function getOrgId(token: string): Promise<string | null> {
    try {
        const res = await axios.get(
            `${LINKEDIN_API}/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "X-Restli-Protocol-Version": "2.0.0",
                },
            }
        );
        const elements = res.data.elements;
        if (elements?.length > 0) {
            return elements[0].organization.replace("urn:li:organization:", "");
        }
        return null;
    } catch {
        return null;
    }
}
