// LinkedIn Auto-Poster — Adone Intelligence
// Posta automaticamente na página da empresa

import axios from "axios";

const LINKEDIN_API = "https://api.linkedin.com/v2";

// Postar na página da empresa
export async function postToLinkedIn(text: string): Promise<string | null> {
    const token = process.env.LINKEDIN_ACCESS_TOKEN;
    const orgId = process.env.LINKEDIN_ORG_ID;

    if (!token || !orgId) {
        console.log("[LinkedIn] Credenciais não configuradas");
        return null;
    }

    try {
        const res = await axios.post(
            `${LINKEDIN_API}/ugcPosts`,
            {
                author: `urn:li:organization:${orgId}`,
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
        if (elements && elements.length > 0) {
            const urn = elements[0].organization;
            return urn.replace("urn:li:organization:", "");
        }
        return null;
    } catch (err: any) {
        console.error("[LinkedIn] Erro ao buscar org:", err?.response?.data || err.message);
        return null;
    }
}
