// LinkedIn Auto-Poster — Adone Intelligence
// Texto + imagem, publicado como a página da empresa

import axios from "axios";
import { daysUntilExpiry, getConnection } from "./connection";

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
                "Content-Type": "image/jpeg",
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

// Publica na página da Adone (nunca no perfil pessoal). Lança erro para a rodada registrar a falha.
export async function postToLinkedIn(text: string, imageBuffer?: Buffer | null): Promise<string> {
    const connection = await getConnection();
    if (!connection) throw new Error("LinkedIn não conectado: use \"Conectar LinkedIn\" no painel");
    const expiresIn = daysUntilExpiry(connection);
    if (expiresIn !== null && expiresIn < 0) throw new Error("A conexão com o LinkedIn expirou: reconecte no painel");

    const author = `urn:li:organization:${connection.orgId}`;
    try {
        const assetUrn = imageBuffer ? await uploadImage(connection.token, author, imageBuffer) : null;
        const postId = await ugcPost(connection.token, author, text, assetUrn);
        console.log(`[LinkedIn] Publicado na página: ${postId}`);
        return postId;
    } catch (err: any) {
        const detail = err?.response?.data ? JSON.stringify(err.response.data) : err.message;
        throw new Error(`LinkedIn recusou a publicação: ${String(detail).slice(0, 300)}`);
    }
}
