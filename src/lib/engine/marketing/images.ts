// Imagens de capa do blog: geradas pela OpenAI e guardadas no Google Drive (pasta "Adone — Blog").
// O site as entrega por /blog/imagem/[id], com cache longo.

import { Readable } from "stream";
import OpenAI from "openai";
import { drive, type drive_v3 } from "@googleapis/drive";
import { auth } from "@googleapis/calendar";

export const IMAGE_MODEL = process.env.MARKETING_IMAGE_MODEL || "gpt-image-2.5-flare";

// Estilo fixo para o blog ter identidade visual consistente
const STYLE = "Ilustração editorial moderna e abstrata para blog de tecnologia B2B, paleta em tons de roxo, violeta e índigo sobre fundo escuro, formas geométricas e linhas de dados, iluminação suave. Sem texto, sem letras, sem números, sem logotipos, sem pessoas reconhecíveis.";

let openai: OpenAI | null = null;
let driveClient: drive_v3.Drive | null = null;

function openaiClient(): OpenAI {
    if (!openai) {
        const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "");
        if (!apiKey) throw new Error("OPENAI_API_KEY ausente");
        openai = new OpenAI({ apiKey });
    }
    return openai;
}

function driveApi(): drive_v3.Drive {
    if (!driveClient) {
        const client = new auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
        client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
        driveClient = drive({ version: "v3", auth: client as unknown as drive_v3.Options["auth"] });
    }
    return driveClient;
}

export function imagesConfigured(): boolean {
    return Boolean(process.env.GOOGLE_DRIVE_FOLDER_ID && process.env.GOOGLE_REFRESH_TOKEN);
}

// Gera a capa (1536x1024, webp) e salva no Drive; devolve o ID do arquivo
export async function createCoverImage(subject: string, slug: string): Promise<string> {
    const result = await openaiClient().images.generate({
        model: IMAGE_MODEL,
        prompt: `${STYLE}\n\nTema da ilustração: ${subject}`,
        size: "1536x1024",
        quality: "medium",
        output_format: "webp",
        output_compression: 82,
    });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) throw new Error("A geração de imagem não devolveu arquivo");

    const { data } = await driveApi().files.create({
        requestBody: {
            name: `${slug}.webp`,
            mimeType: "image/webp",
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
        },
        media: { mimeType: "image/webp", body: Readable.from(Buffer.from(b64, "base64")) },
        fields: "id",
    });
    if (!data.id) throw new Error("O Drive não devolveu o ID da imagem");
    return data.id;
}

export async function downloadImage(fileId: string): Promise<Buffer> {
    const res = await driveApi().files.get({ fileId, alt: "media" }, { responseType: "arraybuffer" });
    return Buffer.from(res.data as ArrayBuffer);
}
