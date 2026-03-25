# Como rodar o projeto

## Pré-requisitos

- [Node.js](https://nodejs.org) **v18 ou superior**
- [pnpm](https://pnpm.io) — instale globalmente caso não tenha:
  ```bash
  npm install -g pnpm
  ```

---

## 1. Navegar até o projeto

```bash
cd c:/Site/adone/luro-ai
```

---

## 2. Instalar dependências

```bash
pnpm install
```

---

## 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com seus dados:

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```env
# App
NEXT_PUBLIC_APP_NAME=Adone AI
NEXT_PUBLIC_APP_DOMAIN=https://adoneai.com.br
SITE_URL=https://adoneai.com.br

# E-mail SMTP (Hostinger)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=contato@adoneai.com.br
EMAIL_PASS=sua_senha_aqui

# Destinatário dos leads
RECIPIENT_EMAIL=contato@adoneai.com.br
RECIPIENT_NAME=Adone AI
```

> O formulário de contato só envia e-mails se `EMAIL_PASS` estiver preenchido.
> Para rodar localmente sem e-mail, deixe como está — a página funciona normalmente.

---

## 3. Ambiente de desenvolvimento

```bash
pnpm dev
```

Acesse **http://localhost:3000**

As alterações nos arquivos refletem automaticamente no navegador (hot reload).

---

## 4. Build de produção

```bash
pnpm build
```

---

## 5. Rodar em produção (após o build)

```bash
pnpm start
```

Acesse **http://localhost:3000**

---

## Estrutura resumida

```
src/
├── app/
│   ├── (marketing)/page.tsx   # Landing page principal
│   └── api/contact/route.ts   # API de envio de e-mail
├── components/
│   ├── marketing/             # Seções da landing page
│   └── ui/                    # Componentes visuais
public/
│   ├── icons/                 # Logo e ícones
│   └── img/                   # Imagens gerais
```

---

## Deploy na Hostinger (Node.js)

1. Faça o build local: `pnpm build`
2. Envie os arquivos para o servidor via Git ou FTP (sem a pasta `node_modules`)
3. No painel da Hostinger, defina o comando de start: `pnpm start`
4. Configure as variáveis de ambiente no painel da Hostinger
5. O servidor roda na porta definida pela Hostinger (variável `PORT`)
