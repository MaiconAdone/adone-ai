// LinkedIn Auto-Poster — Adone Intelligence
// Posta automaticamente no perfil pessoal (vinculado à página da empresa)

import axios from "axios";

const LINKEDIN_API = "https://api.linkedin.com/v2";

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

// Postar no LinkedIn (perfil pessoal ou página da empresa)
export async function postToLinkedIn(text: string): Promise<string | null> {
    const token = process.env.LINKEDIN_ACCESS_TOKEN;
    const memberId = process.env.LINKEDIN_MEMBER_ID;
    const orgId = process.env.LINKEDIN_ORG_ID;

    if (!token) {
        console.log("[LinkedIn] LINKEDIN_ACCESS_TOKEN não configurado");
        return null;
    }

    // Usar org se disponível, senão usar perfil pessoal
    const author = orgId
        ? `urn:li:organization:${orgId}`
        : `urn:li:person:${memberId}`;

    if (!orgId && !memberId) {
        console.log("[LinkedIn] LINKEDIN_ORG_ID ou LINKEDIN_MEMBER_ID necessário");
        return null;
    }

    try {
        const res = await axios.post(
            `${LINKEDIN_API}/ugcPosts`,
            {
                author,
                lifecycleState: "PUBLISHED",
                specificContent: {
                    "com.linkedin.ugc.ShareContent": {
                        shareCommentary: { text },
                        shareMediaCategory: "NONE",
                    },
                },
                visibility: {
                    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "X-Restli-Protocol-Version": "2.0.0",
                },
            }
        );

        const postId = res.headers["x-restli-id"] || res.data.id;
        console.log(`[LinkedIn] Post publicado: ${postId}`);
        return postId;
    } catch (err: any) {
        console.error("[LinkedIn] Erro ao postar:", err?.response?.data || err.message);
        return null;
    }
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
