// Imagens de capa do blog: geradas pela OpenAI e guardadas no Google Drive (pasta "Adone — Blog").
// O site as entrega por /blog/imagem/[id], com cache longo.

import { Readable } from "stream";
import OpenAI from "openai";
import sharp from "sharp";
import { drive, type drive_v3 } from "@googleapis/drive";
import { auth } from "@googleapis/calendar";

export const IMAGE_MODEL = process.env.MARKETING_IMAGE_MODEL || "gpt-image-2.5-flare";

// Estilo fixo para o blog ter identidade visual consistente. Neutro: combina com o tema claro do site
// (nada de fundo preto nem branco puro; roxo só como acento).
const STYLE = "Fotografia editorial realista e sóbria de ambiente corporativo ou operacional ligado ao tema (escritório, indústria, centro de distribuição, loja, equipe analisando dados), luz natural suave, tons neutros (cinza, bege, madeira, branco quebrado), contraste médio, pequenos acentos em verde-água, profundidade de campo rasa. Sem fundo preto, sem fundo branco puro, sem aparência de ilustração 3D ou neon. Sem texto, sem letras, sem números legíveis, sem logotipos, sem rostos em primeiro plano identificáveis.";

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

const COVER_WIDTH = 1536;
const COVER_HEIGHT = 1024;

async function saveToDrive(webp: Buffer, slug: string): Promise<string> {
    const { data } = await driveApi().files.create({
        requestBody: {
            name: `${slug}.webp`,
            mimeType: "image/webp",
            parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
        },
        media: { mimeType: "image/webp", body: Readable.from(webp) },
        fields: "id",
    });
    if (!data.id) throw new Error("O Drive não devolveu o ID da imagem");
    return data.id;
}

// Gera a capa (1536x1024, webp) e salva no Drive; devolve o ID do arquivo.
// "details" permite ao Maicon descrever a imagem que quer ao trocar a capa.
export async function createCoverImage(subject: string, slug: string, details = ""): Promise<string> {
    const result = await openaiClient().images.generate({
        model: IMAGE_MODEL,
        prompt: `${STYLE}

Tema da ilustração: ${subject}${details ? `

Pedido específico para esta imagem: ${details}` : ""}`,
        size: `${COVER_WIDTH}x${COVER_HEIGHT}`,
        quality: "medium",
        output_format: "webp",
        output_compression: 82,
    });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) throw new Error("A geração de imagem não devolveu arquivo");
    return saveToDrive(Buffer.from(b64, "base64"), slug);
}

// Imagem dos posts da página no LinkedIn: mesmo estilo das capas, recortada para o feed (1200x627, JPEG)
export async function createLinkedInImage(subject: string): Promise<Buffer> {
    const result = await openaiClient().images.generate({
        model: IMAGE_MODEL,
        prompt: `${STYLE}

Tema da ilustração: ${subject}

Enquadramento horizontal, assunto principal centralizado (a imagem será recortada nas bordas de cima e de baixo).`,
        size: `${COVER_WIDTH}x${COVER_HEIGHT}`,
        quality: "medium",
        output_format: "png",
    });
    const b64 = result.data?.[0]?.b64_json;
    if (!b64) throw new Error("A geração de imagem não devolveu arquivo");
    return sharp(Buffer.from(b64, "base64")).resize(1200, 627, { fit: "cover", position: "centre" }).jpeg({ quality: 88 }).toBuffer();
}

// Imagem enviada pelo Maicon: recortada no formato da capa (3:2) e convertida para webp.
// Decodificar com sharp também garante que o arquivo é mesmo uma imagem.
export async function uploadCoverImage(file: Buffer, slug: string): Promise<string> {
    const webp = await sharp(file, { limitInputPixels: 50_000_000 })
        .rotate()
        .resize(COVER_WIDTH, COVER_HEIGHT, { fit: "cover", position: "attention" })
        .webp({ quality: 82 })
        .toBuffer();
    return saveToDrive(webp, slug);
}

export async function downloadImage(fileId: string): Promise<Buffer> {
    const res = await driveApi().files.get({ fileId, alt: "media" }, { responseType: "arraybuffer" });
    return Buffer.from(res.data as ArrayBuffer);
}
