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

## 6. Configurar integração com LinkedIn

O projeto **já possui a base da integração pronta** para:

- autenticar via OAuth no LinkedIn;
- gerar texto automaticamente com IA;
- gerar imagem branded para o post;
- publicar no perfil pessoal ou página da empresa;
- receber disparo manual ou automático via endpoint.

### Variáveis necessárias

Adicione também no `.env.local` ou no painel da Hostinger:

```env
ANTHROPIC_API_KEY=sua_chave_anthropic
WEBHOOK_SECRET=um_segredo_forte

SITE_URL=https://seu-dominio.com.br

LINKEDIN_CLIENT_ID=seu_client_id_linkedin
LINKEDIN_CLIENT_SECRET=seu_client_secret_linkedin

# preenchidas após o OAuth
LINKEDIN_ACCESS_TOKEN=
LINKEDIN_MEMBER_ID=
LINKEDIN_ORG_ID=
```

### 1. Criar app no LinkedIn Developer

No portal de desenvolvedores do LinkedIn:

1. crie um app;
2. associe a página da empresa, se quiser postar como organização;
3. configure a redirect URL:

```text
https://seu-dominio.com.br/api/auth/linkedin
```

4. habilite os escopos usados pelo projeto:
   - `openid`
   - `profile`
   - `w_member_social`
   - `w_organization_social`
   - `r_organization_social`

### 2. Obter token e IDs

Com o projeto rodando e as variáveis `LINKEDIN_CLIENT_ID` e `LINKEDIN_CLIENT_SECRET` configuradas, acesse:

```text
https://seu-dominio.com.br/api/linkedin/connect
```

Após autorizar no LinkedIn, o callback `/api/auth/linkedin` retorna em JSON:

- `LINKEDIN_ACCESS_TOKEN`
- `LINKEDIN_MEMBER_ID`
- `LINKEDIN_ORG_ID`

Copie esses valores para o `.env.local` ou para as variáveis da Hostinger.

### 3. Testar publicação manual

Você pode publicar um texto específico via `POST /api/linkedin` enviando o header `x-webhook-secret`.

Exemplo com `curl`:

```bash
curl -X POST http://localhost:3000/api/linkedin ^
  -H "Content-Type: application/json" ^
  -H "x-webhook-secret: um_segredo_forte" ^
  -d "{\"text\":\"Teste de postagem automática no LinkedIn com imagem gerada pelo sistema.\"}"
```

Se o corpo não enviar `text`, o sistema usa o gerador automático e publica um conteúdo novo com base no scheduler interno.

### 4. Como automatizar de verdade

O projeto possui a função de geração e postagem, mas **não existe um cron ativo em produção por padrão**.

Ou seja: para a automação recorrente, você deve configurar **um agendador externo** chamando o endpoint abaixo:

```text
POST /api/linkedin
```

Opções recomendadas:

- Cron Jobs da Hostinger, se disponíveis no plano;
- serviço externo como EasyCron, cron-job.org ou GitHub Actions;
- automação via n8n / Make / Zapier.

Essa chamada deve enviar o header:

```text
x-webhook-secret: seu WEBHOOK_SECRET
```

### Observações importantes

- o token do LinkedIn expira; será necessário renovar periodicamente;
- se `LINKEDIN_ORG_ID` não estiver disponível, o sistema tenta postar no perfil pessoal;
- a imagem do post é gerada em `src/lib/engine/linkedin/image-generator.tsx`;
- a publicação é feita por `src/lib/engine/linkedin/poster.ts`;
- a geração automática do conteúdo está em `src/lib/engine/linkedin/scheduler.ts`.

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
