// LinkedIn Auto-Poster — Adone Intelligence
// Suporta texto + imagem, com fallback org→perfil pessoal

import axios from "axios";
import { generateLinkedInImage } from "./image-generator";

const API = "https://api.linkedin.com/v2";

export async function getMemberId(token: string): Promise<string | null> {
    try {
        const res = await axios.get(`${API}/userinfo`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.sub;
    } catch (err: any) {
        console.error("[LinkedIn] Erro ao buscar memberId:", err?.response?.data || err.message);
        return null;
    }
}

export async function getOrgId(token: string): Promise<string | null> {
    try {
        const res = await axios.get(
            `${API}/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED`,
            { headers: { Authorization: `Bearer ${token}`, "X-Restli-Protocol-Version": "2.0.0" } }
        );
        const el = res.data.elements;
        if (el?.length > 0) return el[0].organization.replace("urn:li:organization:", "");
        return null;
    } catch {
        return null;
    }
}

// Faz upload de uma imagem e retorna o asset URN
async function uploadImage(token: string, author: string, imageBuffer: Buffer): Promise<string | null> {
    try {
        // 1. Registrar upload
        const registerRes = await axios.post(
            `${API}/assets?action=registerUpload`,
            {
                registerUploadRequest: {
                    recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                    owner: author,
                    serviceRelationships: [{
                        relationshipType: "OWNER",
                        identifier: "urn:li:userGeneratedContent",
                    }],
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

        const uploadUrl = registerRes.data.value.uploadMechanism[
            "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
        ].uploadUrl;
        const assetUrn = registerRes.data.value.asset;

        // 2. Upload do binário
        await axios.put(uploadUrl, imageBuffer, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "image/png",
            },
        });

        console.log(`[LinkedIn] Imagem enviada: ${assetUrn}`);
        return assetUrn;
    } catch (err: any) {
        console.error("[LinkedIn] Erro ao fazer upload de imagem:", err?.response?.data || err.message);
        return null;
    }
}

// Cria o ugcPost com ou sem imagem
async function ugcPost(token: string, author: string, text: string, assetUrn?: string | null): Promise<string> {
    const shareContent = assetUrn
        ? {
            shareCommentary: { text },
            shareMediaCategory: "IMAGE",
            media: [{
                status: "READY",
                description: { text: "Adone Intelligence" },
                media: assetUrn,
                title: { text: "Adone Intelligence" },
            }],
        }
        : {
            shareCommentary: { text },
            shareMediaCategory: "NONE",
        };

    const res = await axios.post(
        `${API}/ugcPosts`,
        {
            author,
            lifecycleState: "PUBLISHED",
            specificContent: { "com.linkedin.ugc.ShareContent": shareContent },
            visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
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

export async function postToLinkedIn(text: string, withImage = true): Promise<string | null> {
    const token    = process.env.LINKEDIN_ACCESS_TOKEN;
    const memberId = process.env.LINKEDIN_MEMBER_ID;
    const orgId    = process.env.LINKEDIN_ORG_ID;

    if (!token) { console.log("[LinkedIn] Token não configurado"); return null; }
    if (!orgId && !memberId) { console.log("[LinkedIn] IDs não configurados"); return null; }

    // Gera imagem branded
    let imageBuffer: Buffer | null = null;
    if (withImage) {
        try {
            imageBuffer = await generateLinkedInImage(text);
            console.log("[LinkedIn] Imagem gerada com sucesso");
        } catch (err) {
            console.error("[LinkedIn] Falha ao gerar imagem, postando só texto:", err);
        }
    }

    // Tenta org primeiro, depois perfil pessoal (fallback)
    const authors: string[] = [];
    if (orgId)    authors.push(`urn:li:organization:${orgId}`);
    if (memberId) authors.push(`urn:li:person:${memberId}`);

    for (const author of authors) {
        console.log(`[LinkedIn] Tentando postar como: ${author}`);
        try {
            let assetUrn: string | null = null;
            if (imageBuffer) {
                assetUrn = await uploadImage(token, author, imageBuffer);
            }
            const postId = await ugcPost(token, author, text, assetUrn);
            console.log(`[LinkedIn] Publicado como ${author}: ${postId}`);
            return postId;
        } catch (err: any) {
            console.error(`[LinkedIn] Falhou com ${author}:`, err?.response?.data || err.message);
        }
    }

    return null;
}
