// LinkedIn Auto-Poster — Adone Intelligence

import axios from "axios";

const LINKEDIN_API = "https://api.linkedin.com/v2";

export async function getMemberId(token: string): Promise<string | null> {
    try {
        const res = await axios.get(`${LINKEDIN_API}/userinfo`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.sub;
    } catch (err: any) {
        console.error("[LinkedIn] Erro ao buscar memberId:", err?.response?.data || err.message);
        return null;
    }
}

async function ugcPost(token: string, author: string, text: string): Promise<string | null> {
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
    return res.headers["x-restli-id"] || res.data?.id || "published";
}

export async function postToLinkedIn(text: string): Promise<string | null> {
    const token    = process.env.LINKEDIN_ACCESS_TOKEN;
    const memberId = process.env.LINKEDIN_MEMBER_ID;
    const orgId    = process.env.LINKEDIN_ORG_ID;

    if (!token) {
        console.log("[LinkedIn] LINKEDIN_ACCESS_TOKEN não configurado");
        return null;
    }
    if (!orgId && !memberId) {
        console.log("[LinkedIn] LINKEDIN_ORG_ID ou LINKEDIN_MEMBER_ID necessário");
        return null;
    }

    const authorsToTry: string[] = [];
    if (orgId)    authorsToTry.push(`urn:li:organization:${orgId}`);
    if (memberId) authorsToTry.push(`urn:li:person:${memberId}`);

    for (const author of authorsToTry) {
        console.log(`[LinkedIn] Tentando postar como: ${author}`);
        try {
            const postId = await ugcPost(token, author, text);
            console.log(`[LinkedIn] Post publicado como ${author}: ${postId}`);
            return postId;
        } catch (err: any) {
            console.error(`[LinkedIn] Falhou com ${author}:`, JSON.stringify(err?.response?.data) || err.message);
        }
    }

    return null;
}

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
