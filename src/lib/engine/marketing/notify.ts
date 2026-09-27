// Aviso ao Maicon (WhatsApp) quando algo dos agentes precisa de aprovação

import { sendWhatsApp, toWhatsAppNumber } from "../agenda/notifications";
import { sheetId } from "../agenda/google";

export function sheetUrl(): string {
    return `https://docs.google.com/spreadsheets/d/${sheetId()}/edit`;
}

export async function notifyOwner(message: string): Promise<void> {
    const phone = toWhatsAppNumber(process.env.MARKETING_NOTIFY_PHONE);
    if (!phone) {
        console.log(`[Marketing] MARKETING_NOTIFY_PHONE não configurado. Aviso:\n${message}`);
        return;
    }
    await sendWhatsApp(phone, `${message}\n\n📋 Planilha: ${sheetUrl()}`);
}
