# Deploy — Adone AI → Hostinger Node.js

## Qual projeto publicar primeiro?
→ **luro-ai** (o site principal — Next.js)

---

## OPÇÃO A — Upload de arquivos (mais rápido agora)

### Passo 1 — Gerar o build de produção

```bash
cd c:/Site/adone/luro-ai
pnpm build
```

### Passo 2 — Criar o arquivo .zip para upload

Compacte os seguintes arquivos/pastas (NÃO inclua `node_modules` nem `.git`):

```
✅ .next/
✅ public/
✅ src/
✅ package.json
✅ package-lock.json  ← gere com: npm install --package-lock-only
✅ next.config.js (ou .mjs, se existir)
✅ tailwind.config.ts
✅ tsconfig.json
✅ postcss.config.js
❌ node_modules/     ← NÃO incluir
❌ .git/             ← NÃO incluir
❌ .env.example      ← NÃO incluir
```

### Passo 3 — Configurar variáveis de ambiente na Hostinger

No painel da Hostinger → **Variáveis de Ambiente**, adicione:

```
NEXT_PUBLIC_APP_NAME=Adone AI
NEXT_PUBLIC_APP_DOMAIN=https://adoneintelligence.com.br
SITE_URL=https://adoneintelligence.com.br
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=contato@adoneintelligence.com.br
EMAIL_PASS=SUA_SENHA_REAL_AQUI
RECIPIENT_EMAIL=contato@adoneintelligence.com.br
RECIPIENT_NAME=Adone AI
```

### Passo 4 — Configurar o startup na Hostinger

No painel → **Configurações Node.js**:

| Campo | Valor |
|---|---|
| Versão Node.js | 18.x ou 20.x |
| Arquivo de entrada | `node_modules/.bin/next` |
| Comando de start | `npm start` |
| Modo | Production |

### Passo 5 — Fazer o upload e iniciar

1. Clique em **"Faça upload dos arquivos"** → **Continuar**
2. Envie o `.zip` criado no Passo 2
3. Clique em **Iniciar aplicação**

---

## OPÇÃO B — GitHub (recomendado para atualizações futuras)

### Passo 1 — Criar repositório no GitHub

```bash
cd c:/Site/adone/luro-ai

# Inicializar git (se ainda não tiver)
git init
git add .
git commit -m "feat: deploy inicial Adone AI"

# Criar repo no GitHub e conectar
git remote add origin https://github.com/SEU_USUARIO/adone-ai.git
git push -u origin main
```

### Passo 2 — Conectar na Hostinger

1. Clique em **"Conecte-se com GitHub"**
2. Autorize a Hostinger no GitHub
3. Selecione o repositório `adone-ai`
4. Branch: `main`

### Passo 3 — Configurar build na Hostinger

| Campo | Valor |
|---|---|
| Comando de build | `npm install && npm run build` |
| Comando de start | `npm start` |
| Versão Node.js | 20.x |
| Diretório raiz | `/` |

### Passo 4 — Variáveis de ambiente

Mesmo do **Passo 3 da Opção A** acima.

### Vantagem do GitHub:
Toda vez que fizer `git push`, a Hostinger faz deploy automático. ✨

---

## Configurar o domínio adoneintelligence.com.br

No painel da Hostinger → **Domínios**:

1. Aponte o domínio para a aplicação Node.js
2. Ative o **SSL gratuito** (Let's Encrypt)
3. Aguarde propagação: 5 min a 2 horas

---

## Criar o e-mail contato@adoneintelligence.com.br

1. Hostinger → **E-mails** → **Criar conta**
2. E-mail: `contato@adoneintelligence.com.br`
3. Crie uma senha forte
4. **Copie essa senha** → coloque no campo `EMAIL_PASS` das variáveis de ambiente

---

## Verificar se o deploy funcionou

Acesse: `https://adoneintelligence.com.br`

Teste o formulário de contato enviando uma mensagem — deve chegar em `contato@adoneintelligence.com.br`.

---

## Troubleshooting

**Erro: "Cannot find module"**
→ Rode `npm install` no servidor antes de `npm start`

**Erro: "Port already in use"**
→ A Hostinger injeta a variável `PORT` automaticamente. O Next.js respeita isso.

**Site carrega mas sem CSS**
→ Verifique se `.next/static/` foi incluído no upload

**Formulário não envia e-mail**
→ Confirme que `EMAIL_PASS` está correto nas variáveis de ambiente
→ Teste o SMTP: `smtp.hostinger.com` porta `465` com SSL
