// Carrega as variáveis de servidor gravadas no build por scripts/write-runtime-env.mjs,
// para hospedagens que só as expõem durante o build. Não sobrescreve o que já existe.

import { existsSync, readFileSync } from "fs";
import { join } from "path";

export function loadRuntimeEnv(): void {
    const file = join(process.cwd(), ".runtime-env.json");
    if (!existsSync(file)) return;

    try {
        const values = JSON.parse(readFileSync(file, "utf-8")) as Record<string, string>;
        let loaded = 0;
        for (const [name, value] of Object.entries(values)) {
            if (!process.env[name] && typeof value === "string") {
                process.env[name] = value;
                loaded++;
            }
        }
        console.log(`[runtime-env] ${loaded} variáveis carregadas de .runtime-env.json`);
    } catch (err) {
        console.error("[runtime-env] Falha ao ler .runtime-env.json", err);
    }
}
