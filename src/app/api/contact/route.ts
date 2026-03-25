import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host:   process.env.EMAIL_HOST   || "smtp.hostinger.com",
    port:   parseInt(process.env.EMAIL_PORT || "465"),
    secure: process.env.EMAIL_SECURE !== "false",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { name, email, company, phone, companySize, interest, message, website } = body;

    // Honeypot anti-spam
    if (website) {
        return NextResponse.json({ ok: true });
    }

    if (!name?.trim() || !email?.trim() || !company?.trim()) {
        return NextResponse.json(
            { ok: false, message: "Preencha nome, e-mail e empresa." },
            { status: 400 }
        );
    }

    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
        return NextResponse.json(
            { ok: false, message: "E-mail inválido." },
            { status: 400 }
        );
    }

    const leadHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
  .card{max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.1)}
  .header{background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:32px;text-align:center}
  .header h1{color:#fff;font-size:22px;margin:0}
  .header p{color:rgba(255,255,255,.8);font-size:13px;margin:8px 0 0}
  .body{padding:32px}
  .field{margin-bottom:20px;border-bottom:1px solid #f0f0f0;padding-bottom:16px}
  .field:last-of-type{border-bottom:none}
  .label{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;font-weight:600;margin-bottom:4px}
  .value{font-size:15px;color:#111827;font-weight:500}
  .cta{display:inline-block;margin-top:16px;padding:12px 28px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px}
  .footer{background:#f9f9f9;padding:20px 32px;text-align:center;font-size:12px;color:#9ca3af}
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <h1>🧠 Novo Lead — Adone AI</h1>
    <p>Um novo contato preencheu o formulário de diagnóstico gratuito</p>
  </div>
  <div class="body">
    <div class="field"><div class="label">Nome</div><div class="value">${name}</div></div>
    <div class="field"><div class="label">E-mail</div><div class="value">${email}</div></div>
    <div class="field"><div class="label">Empresa</div><div class="value">${company}</div></div>
    <div class="field"><div class="label">Telefone / WhatsApp</div><div class="value">${phone || "—"}</div></div>
    <div class="field"><div class="label">Porte da empresa</div><div class="value">${companySize || "—"}</div></div>
    <div class="field"><div class="label">Principal interesse</div><div class="value">${interest || "—"}</div></div>
    <div class="field"><div class="label">Mensagem / Contexto</div><div class="value">${(message || "—").replace(/\n/g, "<br>")}</div></div>
    <div style="text-align:center;margin-top:24px">
      <a href="mailto:${email}" class="cta">Responder para ${name}</a>
    </div>
  </div>
  <div class="footer">Enviado em ${new Date().toLocaleString("pt-BR")} · Adone AI · ${process.env.SITE_URL || ""}</div>
</div>
</body></html>`;

    const autoReplyHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8">
<style>
  body{font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:20px}
  .card{max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden}
  .header{background:linear-gradient(135deg,#7c3aed,#6d28d9);padding:36px;text-align:center}
  .header h1{color:#fff;font-size:22px;margin:0 0 8px}
  .header p{color:rgba(255,255,255,.85);font-size:14px;margin:0}
  .body{padding:36px}
  .body p{font-size:15px;color:#374151;line-height:1.7;margin-bottom:16px}
  .highlight{background:#f5f3ff;border-left:3px solid #7c3aed;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0}
  .highlight p{margin:6px 0;font-size:14px}
  .cta{display:block;text-align:center;margin:28px 0}
  .cta a{display:inline-block;padding:14px 32px;background:#7c3aed;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px}
  .footer{background:#f9f9f9;padding:20px;text-align:center;font-size:12px;color:#9ca3af;border-top:1px solid #eee}
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <h1>Mensagem Recebida! ✓</h1>
    <p>Obrigado pelo seu interesse na Adone AI</p>
  </div>
  <div class="body">
    <p>Olá, <strong>${name}</strong>!</p>
    <p>Recebemos sua mensagem e nossa equipe comercial já foi notificada. Entraremos em contato em até <strong>4 horas úteis</strong> para agendar o diagnóstico gratuito.</p>
    <div class="highlight">
      <p><strong>O que você pode esperar do diagnóstico:</strong></p>
      <p>✓ Reunião de 60 min com especialista em IA</p>
      <p>✓ Mapeamento dos seus dados e processos</p>
      <p>✓ Identificação das maiores oportunidades</p>
      <p>✓ Estimativa de ROI potencial</p>
      <p>✓ Proposta preliminar sem compromisso</p>
    </div>
    <div class="cta"><a href="${process.env.SITE_URL || "#"}">Conhecer as Soluções</a></div>
  </div>
  <div class="footer">
    © ${new Date().getFullYear()} Adone AI · ${process.env.SITE_URL || ""}<br>
    <span style="font-size:11px">Você recebeu este e-mail porque preencheu o formulário de contato em nosso site.</span>
  </div>
</div>
</body></html>`;

    try {
        await transporter.sendMail({
            from:    `"${name}" <${process.env.EMAIL_USER}>`,
            replyTo: email,
            to:      `"${process.env.RECIPIENT_NAME}" <${process.env.RECIPIENT_EMAIL}>`,
            subject: `Novo Lead: ${name} — ${company}`,
            html:    leadHtml,
        });

        // Auto-reply (non-blocking)
        transporter.sendMail({
            from:    `"${process.env.RECIPIENT_NAME}" <${process.env.EMAIL_USER}>`,
            replyTo: process.env.RECIPIENT_EMAIL,
            to:      email,
            subject: "Recebemos sua mensagem — Adone AI",
            html:    autoReplyHtml,
        }).catch(console.error);

        return NextResponse.json({ ok: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Erro desconhecido";
        console.error("[Contact] Erro ao enviar e-mail:", message);
        return NextResponse.json(
            { ok: false, message: "Erro ao enviar. Tente novamente." },
            { status: 500 }
        );
    }
}
