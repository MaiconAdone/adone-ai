// Gerador de imagem branded para posts do LinkedIn
// Usa next/og (ImageResponse) — sem dependências nativas externas

import { ImageResponse } from "next/og";
import React from "react";

function wrapText(text: string, maxChars: number): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let current = "";
    for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (candidate.length > maxChars) {
            if (current) lines.push(current);
            current = word;
        } else {
            current = candidate;
        }
    }
    if (current) lines.push(current);
    return lines;
}

export async function generateLinkedInImage(postText: string): Promise<Buffer> {
    const clean = postText.replace(/#\w+/g, "").trim();
    const firstPart = clean.split("\n").filter(l => l.trim()).slice(0, 2).join(" ");
    const headline = firstPart.length > 70 ? firstPart.slice(0, 67) + "..." : firstPart;
    const headlineLines = wrapText(headline, 28);
    const subText = clean.replace(firstPart, "").trim().slice(0, 130);
    const subLines = wrapText(subText, 48).slice(0, 3);

    const response = new ImageResponse(
        React.createElement(
            "div",
            {
                style: {
                    width: 1200, height: 627,
                    display: "flex", flexDirection: "column",
                    background: "linear-gradient(135deg, #f8fafc 0%, #e2f4f1 100%)",
                    fontFamily: "sans-serif",
                    position: "relative",
                    overflow: "hidden",
                },
            },
            // Barra lateral teal
            React.createElement("div", {
                style: {
                    position: "absolute", left: 0, top: 0,
                    width: 12, height: 627,
                    background: "linear-gradient(180deg, #0d9488, #14b8a6)",
                },
            }),
            // Círculo decorativo dir
            React.createElement("div", {
                style: {
                    position: "absolute", right: -80, top: -60,
                    width: 360, height: 360, borderRadius: "50%",
                    background: "rgba(13,148,136,0.07)",
                },
            }),
            React.createElement("div", {
                style: {
                    position: "absolute", right: -40, bottom: -40,
                    width: 240, height: 240, borderRadius: "50%",
                    background: "rgba(20,184,166,0.09)",
                },
            }),
            // Conteúdo
            React.createElement(
                "div",
                { style: { display: "flex", flexDirection: "column", padding: "52px 80px", flex: 1 } },
                // Logo + nome
                React.createElement(
                    "div",
                    { style: { display: "flex", alignItems: "center", marginBottom: 32 } },
                    React.createElement(
                        "div",
                        {
                            style: {
                                width: 60, height: 60, borderRadius: 14,
                                background: "#0f172a", display: "flex",
                                alignItems: "center", justifyContent: "center", marginRight: 16,
                            },
                        },
                        React.createElement("span", { style: { color: "#14b8a6", fontSize: 22, fontWeight: 900 } }, "AI")
                    ),
                    React.createElement(
                        "div",
                        { style: { display: "flex", flexDirection: "column" } },
                        React.createElement("span", { style: { fontSize: 20, fontWeight: 700, color: "#0f172a" } }, "Adone Intelligence"),
                        React.createElement("span", { style: { fontSize: 14, color: "#64748b" } }, "adoneintelligence.com.br")
                    )
                ),
                // Divisor
                React.createElement("div", {
                    style: {
                        width: 560, height: 3, borderRadius: 2,
                        background: "linear-gradient(90deg, #0d9488, #14b8a6)",
                        marginBottom: 36,
                    },
                }),
                // Headline
                ...headlineLines.map(line =>
                    React.createElement("div", {
                        key: line,
                        style: { fontSize: 52, fontWeight: 900, color: "#0f172a", lineHeight: 1.15, marginBottom: 4 },
                    }, line)
                ),
                React.createElement("div", { style: { height: 20 } }),
                // Subtítulo
                ...subLines.map(line =>
                    React.createElement("div", {
                        key: line,
                        style: { fontSize: 28, color: "#475569", lineHeight: 1.4, marginBottom: 2 },
                    }, line)
                ),
            ),
            // Rodapé
            React.createElement(
                "div",
                {
                    style: {
                        position: "absolute", bottom: 40, left: 80, right: 80,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                    },
                },
                React.createElement(
                    "div",
                    { style: { background: "#0d9488", borderRadius: 20, padding: "10px 24px" } },
                    React.createElement("span", { style: { color: "white", fontSize: 15, fontWeight: 700 } }, "Dados que Pensam.")
                ),
                React.createElement("span", { style: { color: "#94a3b8", fontSize: 14 } }, "adoneintelligence.com.br")
            )
        ),
        { width: 1200, height: 627 }
    );

    return Buffer.from(await response.arrayBuffer());
}
