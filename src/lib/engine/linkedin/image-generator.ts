// Gerador de imagem branded para posts do LinkedIn
// Cria PNG 1200x627 com layout da Adone Intelligence

import sharp from "sharp";
import path from "path";
import fs from "fs";

const W = 1200;
const H = 627;

function wrapText(text: string, maxChars: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
        if ((current + " " + word).trim().length > maxChars) {
            if (current) lines.push(current.trim());
            current = word;
        } else {
            current = (current + " " + word).trim();
        }
    }
    if (current) lines.push(current.trim());
    return lines;
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export async function generateLinkedInImage(postText: string): Promise<Buffer> {
    // Pega as primeiras 2 linhas do post como headline
    const firstLines = postText.split("\n").filter(l => l.trim()).slice(0, 2).join(" ");
    const headline = firstLines.length > 80 ? firstLines.slice(0, 77) + "..." : firstLines;
    const headlineLines = wrapText(headline, 38);

    // Restante do texto como subtítulo (máx 3 linhas)
    const remaining = postText.replace(firstLines, "").trim().split("\n").filter(l => l.trim()).join(" ");
    const subLines = wrapText(remaining.slice(0, 160), 55).slice(0, 3);

    const headlineSvgLines = headlineLines.map((line, i) =>
        `<text x="80" y="${220 + i * 72}" font-family="Arial Black, Arial" font-weight="900" font-size="52" fill="#0f172a">${escapeXml(line)}</text>`
    ).join("\n");

    const subSvgLines = subLines.map((line, i) =>
        `<text x="80" y="${220 + headlineLines.length * 72 + 40 + i * 42}" font-family="Arial, sans-serif" font-size="32" fill="#475569">${escapeXml(line)}</text>`
    ).join("\n");

    const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2f4f1"/>
    </linearGradient>
    <linearGradient id="teal" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0d9488"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
  </defs>

  <!-- Fundo -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Barra teal lateral esquerda -->
  <rect x="0" y="0" width="12" height="${H}" fill="url(#teal)"/>

  <!-- Decoração geométrica direita -->
  <circle cx="1050" cy="120" r="180" fill="#0d9488" opacity="0.06"/>
  <circle cx="1120" cy="500" r="120" fill="#14b8a6" opacity="0.08"/>
  <rect x="950" y="200" width="3" height="200" rx="2" fill="#0d9488" opacity="0.2"/>

  <!-- Logo box -->
  <rect x="80" y="52" width="64" height="64" rx="14" fill="#0f172a"/>
  <text x="112" y="97" font-family="Arial Black, Arial" font-weight="900" font-size="28" fill="#14b8a6" text-anchor="middle">AI</text>

  <!-- Empresa -->
  <text x="158" y="78" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#0f172a">Adone Intelligence</text>
  <text x="158" y="100" font-family="Arial, sans-serif" font-size="14" fill="#64748b">adoneintelligence.com.br</text>

  <!-- Divisor -->
  <rect x="80" y="140" width="600" height="3" rx="2" fill="url(#teal)"/>

  <!-- Headline e subtítulo -->
  ${headlineSvgLines}
  ${subSvgLines}

  <!-- Badge inferior -->
  <rect x="80" y="${H - 75}" width="220" height="38" rx="19" fill="#0d9488"/>
  <text x="190" y="${H - 50}" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="white" text-anchor="middle">Dados que Pensam.</text>

  <text x="${W - 80}" y="${H - 48}" font-family="Arial, sans-serif" font-size="13" fill="#94a3b8" text-anchor="end">adoneintelligence.com.br</text>
</svg>`.trim();

    return sharp(Buffer.from(svg)).png().toBuffer();
}
