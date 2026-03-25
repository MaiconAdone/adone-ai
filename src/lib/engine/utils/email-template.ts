// Template base de e-mail com logo da Adone AI

const SITE_URL = process.env.SITE_URL || "https://adoneintelligence.com.br";
const LOGO_URL = `${SITE_URL}/img/logo2.png`;

export function emailBase(content: string, preheader = ""): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Adone AI</title>
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ""}
</head>
<body style="margin:0;padding:0;background:#f4f4f8;font-family:Arial,sans-serif;color:#1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f8;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.07);">

          <!-- Header com logo -->
          <tr>
            <td style="background:linear-gradient(135deg,#0d0d14,#1a1025);padding:28px 32px;border-bottom:2px solid #7c3aed;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${LOGO_URL}" alt="Adone AI" width="48" height="48"
                         style="vertical-align:middle;margin-right:10px;object-fit:contain;border-radius:8px;" />
                    <span style="color:#fff;font-size:20px;font-weight:700;vertical-align:middle;letter-spacing:-0.3px;">
                      Adone AI
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td style="padding:36px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} Adone AI — Inteligência Artificial para Empresas<br/>
                <a href="${SITE_URL}" style="color:#7c3aed;text-decoration:none;">${SITE_URL.replace("https://", "")}</a>
                &nbsp;·&nbsp;
                <a href="${SITE_URL}/privacidade" style="color:#9ca3af;text-decoration:none;">Privacidade</a>
                &nbsp;·&nbsp;
                <a href="mailto:${process.env.EMAIL_USER || "contato@adoneintelligence.com.br"}"
                   style="color:#9ca3af;text-decoration:none;">
                  ${process.env.EMAIL_USER || "contato@adoneintelligence.com.br"}
                </a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
