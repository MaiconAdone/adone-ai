# Plano de Ação Adone AI — Captação, Automação e Escala

> Inspirado em Thiago Concer (prospecção ativa, pipeline, ICP) e Flávio Augusto (geração de valor, autoridade, escala sem depender do fundador).

---

## PARTE 1 — ESTRATÉGIA DE MARKETING DIGITAL COM IA

### 1.1 — Definição do ICP (Ideal Customer Profile)
> Princípio Thiago Concer: "Você não vende para todo mundo. Você vende para quem tem o problema que você resolve."

**Perfil do cliente ideal:**
- Empresas B2B com faturamento acima de R$ 5 milhões/ano
- Setores: Varejo, Logística, Financeiro, Saúde, Agronegócio, Indústria
- Dor: decisões lentas, processos manuais, dados não utilizados
- Cargo do decisor: CEO, CTO, Diretor Comercial, Diretor de Operações
- Tamanho: 50 a 2.000 colaboradores (mid-market)

---

### 1.2 — Motor de Conteúdo com IA (Flávio Augusto: "Entregue valor antes de vender")

**Funil de Conteúdo:**
```
TOPO (Awareness)
  └── Posts LinkedIn: "Como empresas perdem R$ X por não usar IA"
  └── Reels Instagram: casos reais simplificados (30-60s)
  └── YouTube Shorts: automações ao vivo

MEIO (Consideração)
  └── Newsletter semanal com 1 caso de uso de IA no negócio do lead
  └── Mini e-books gratuitos: "5 processos que você pode automatizar esta semana"
  └── Webinars mensais: diagnóstico ao vivo de uma empresa real

FUNDO (Conversão)
  └── Estudo de caso com ROI específico do setor
  └── Diagnóstico gratuito (CTA principal do site)
  └── Proposta automática personalizada por segmento
```

**Ferramentas de IA para produção de conteúdo:**

| Ferramenta | Função | Custo |
|---|---|---|
| Claude API / GPT-4o | Geração de posts, e-mails, roteiros | ~$50/mês |
| Eleven Labs | Narração de vídeos com voz clonada | ~$22/mês |
| HeyGen / Synthesia | Avatar de vídeo (você sem gravar) | ~$30/mês |
| Canva AI | Design automático de posts | $17/mês |
| Descript | Edição de vídeo com IA | $24/mês |
| Make.com | Automação de publicação | $16/mês |

**Pipeline de publicação automática (Make.com):**
```
1. Você aprova o tema do conteúdo (1x/semana, 5 min)
2. Claude gera o texto do post
3. Canva AI gera o design
4. Make.com agenda e publica no LinkedIn, Instagram e Twitter
5. Newsletter enviada automaticamente via Brevo (ex-Sendinblue)
```

---

### 1.3 — Prospecção Ativa com IA (Thiago Concer: "Prospecção é oxigênio do negócio")

**Stack de prospecção automática:**

```
ETAPA 1 — Encontrar leads qualificados
  └── Apollo.io: 50.000+ empresas brasileiras segmentadas por setor/porte/cargo
  └── LinkedIn Sales Navigator: decisores com cargo C-level / Diretores
  └── Hunter.io: e-mails verificados

ETAPA 2 — Enriquecer dados com IA
  └── Clay.com: enriquece cada lead com dados do site, LinkedIn, notícias recentes
  └── IA analisa o site da empresa e identifica "dores" específicas
  └── Personaliza mensagem de abordagem por empresa (1 a 1, em escala)

ETAPA 3 — Cadência de contato automática
  └── Instantly.ai: 300 e-mails/dia personalizados com IA
  └── Lemlist: sequências com LinkedIn + e-mail + WhatsApp
  └── Follow-up automático: dia 1, 3, 7, 14, 30
```

**Modelo de e-mail de prospecção gerado por IA:**
```
Assunto: [Nome da empresa] — vi que vocês estão expandindo para [setor/mercado]

Olá [Nome],

Notei que a [Empresa] tem [dado específico coletado pelo Clay].
Empresas do seu setor geralmente perdem entre 15% e 30% de eficiência
em [processo específico] por não usar modelos preditivos.

Desenvolvemos um diagnóstico gratuito de 30 minutos onde identificamos
exatamente onde a IA pode gerar ROI mensurável para vocês.

Você teria 30 minutos essa semana?

[Link da agenda — terça, quinta ou sábado]
```

---

### 1.4 — SEO com IA (tráfego orgânico de empresas buscando IA)

**Cluster de palavras-chave por intenção de compra:**
```
Alta intenção comercial:
  - "empresa de inteligência artificial São Paulo"
  - "consultoria em machine learning para empresas"
  - "automação com IA B2B"
  - "como implementar IA na minha empresa"
  - "ROI de inteligência artificial"

Conteúdo de autoridade (topo):
  - "machine learning para varejo"
  - "IA para logística"
  - "previsão de demanda com IA"
  - "chatbot para atendimento empresarial"
```

**Estratégia:**
- 2 artigos/mês gerados com IA + revisão humana (30 min por artigo)
- Cada artigo segmentado para um setor específico
- CTA: diagnóstico gratuito em todos os artigos

---

## PARTE 2 — CHATBOT INTELIGENTE COM AGENTES DE IA

### 2.1 — Arquitetura do Chatbot

```
CANAIS DE ENTRADA
├── Site (widget no canto inferior direito)
├── WhatsApp Business API
└── Instagram DM (via ManyChat)

         ↓

ORQUESTRADOR (n8n ou Make.com)
         ↓

AGENTE PRINCIPAL (Claude claude-sonnet-4-6 via API)
├── Agent 1: Qualificador de Lead
│     └── Descobre: setor, porte, dor principal, urgência, orçamento
├── Agent 2: Apresentador de Soluções
│     └── Mapeia problema → solução específica da Adone AI com ROI estimado
├── Agent 3: Agendador
│     └── Integrado ao Cal.com → agenda terça/quinta/sábado 9h-16h
└── Agent 4: Follow-up
      └── Envia material personalizado após conversa
```

### 2.2 — Fluxo de Atendimento Humanizado

```
[Lead entra no site / WhatsApp]
         ↓
"Olá! Sou a Ada, assistente da Adone AI 👋
Antes de qualquer coisa, me conta: qual é o maior
desafio operacional da sua empresa hoje?"

         ↓ (lead responde)

[Agent Qualificador analisa a resposta]
Coleta: nome, empresa, setor, problema, urgência

         ↓

[Agent Apresentador]
"Entendi. Empresas de [setor] como a [empresa do lead]
normalmente conseguem reduzir [X%] de [processo] com
modelos preditivos. Quer que eu te mostre como funcionou
para uma empresa similar?"

→ Envia case do setor automaticamente (PDF ou link)

         ↓

[Agent Qualificador — nível orçamento]
"Para montar um diagnóstico preciso, preciso entender
a estrutura atual de vocês. Vocês já têm algum sistema
de dados (ERP, CRM)? E qual seria o investimento
disponível para um projeto como esse?"

         ↓

[Qualificado: orçamento ≥ R$10k/mês]
→ Agent Agendador entra em ação

"Que ótimo! O Maicon, nosso fundador, tem disponibilidade
essa semana para uma conversa de 30 minutos.
Você prefere terça, quinta ou sábado?"

→ Link Cal.com com horários disponíveis

         ↓

[Não qualificado agora]
→ Entra em sequência de nutrição por e-mail
→ Follow-up automático em 30 dias
```

### 2.3 — Stack Técnica do Chatbot

| Componente | Ferramenta | Função |
|---|---|---|
| LLM | Claude claude-sonnet-4-6 (API) | Conversas humanizadas |
| Orquestrador | n8n (self-hosted) | Fluxos e integrações |
| WhatsApp | Z-API ou Twilio | Canal principal |
| Site | Chatwoot (open source) | Widget no site |
| CRM | HubSpot Free | Registro de leads |
| Agenda | Cal.com | Agendamentos |
| E-mail | Brevo | Nutrição automática |

**Custo estimado mensal:**
```
Claude API (5.000 conversas/mês):  ~$80
n8n (self-hosted VPS):             ~$20
Z-API (WhatsApp):                  ~R$97
Cal.com (Pro):                     ~$12
HubSpot (Free):                    R$0
Brevo (Free até 300 e-mails/dia):  R$0

Total: ~R$850/mês
```

---

## PARTE 3 — ENGENHARIA DE IA PARA ENCONTRAR O PÚBLICO-ALVO

### 3.1 — Sistema de Qualificação Automática de Empresas (Lead Scoring com IA)

```python
# Pseudocódigo do sistema de scoring
CRITÉRIOS DE PONTUAÇÃO:
  + Faturamento estimado > R$5M/ano          → +30 pts
  + Tem ERP/CRM identificado no site         → +20 pts
  + Publicou vaga de dados/BI últimos 90d    → +25 pts
  + Crescimento de equipe > 20% (LinkedIn)   → +15 pts
  + Setor de alta maturidade digital         → +10 pts
  - Empresa < 2 anos                         → -20 pts
  - Setor público / ONG                      → -30 pts

SCORE ≥ 70 → Lead Quente → Prospecção ativa imediata
SCORE 40-69 → Lead Morno → Nurturing por conteúdo
SCORE < 40 → Lead Frio → Remover da lista
```

### 3.2 — Fluxo de Enriquecimento Automático

```
[Apollo.io exporta 500 empresas/semana por setor]
         ↓
[Clay.com enriquece cada empresa]
  - Coleta: site, LinkedIn, notícias, vagas abertas
  - IA analisa: tecnologias usadas, maturidade digital
  - IA personaliza: qual dor específica abordar
         ↓
[Lead Score calculado automaticamente]
         ↓
[Quente] → Instantly.ai dispara e-mail personalizado
[Morno]  → Brevo coloca em sequência de conteúdo
[Frio]   → Arquivo
```

### 3.3 — Radar de Oportunidades (alertas automáticos)

```
MONITORE automaticamente empresas que:
  1. Publicam vagas de "Analista de Dados" → precisam de IA
  2. Anunciam expansão de operações → momento de venda ideal
  3. Mencionam "processos manuais" no LinkedIn → dor exposta
  4. Concorrentes fecharam contrato de IA → urgência criada

Ferramentas:
  - LinkedIn Sales Navigator (alertas de empresa)
  - Google Alerts (nome de empresa + "IA" + "dados")
  - PhantomBuster (scraping ético de LinkedIn)
```

---

## PARTE 4 — AUTOMAÇÃO TOTAL + AGENDA INTELIGENTE

### 4.1 — Configuração da Agenda (Cal.com)

```
DISPONIBILIDADE:
  ✅ Terça-feira:  09h00 – 16h00
  ✅ Quinta-feira: 09h00 – 16h00
  ✅ Sábado:       09h00 – 16h00

  ❌ Segunda, Quarta, Sexta, Domingo: BLOQUEADOS

CONFIGURAÇÕES:
  - Duração da reunião: 30 minutos (diagnóstico)
  - Buffer entre reuniões: 15 minutos
  - Antecedência mínima: 24 horas
  - Máximo por dia: 8 reuniões
  - Reunião: Google Meet (link único por sessão)
```

**URL de agendamento pública:** `cal.com/maicon-adone/diagnostico`

### 4.2 — Automações pós-agendamento (n8n)

```
[Lead agenda no Cal.com]
         ↓
[n8n dispara automaticamente:]

1. E-mail de confirmação personalizado (imediato)
   "Sua reunião está confirmada! Enquanto isso,
    preparei 3 casos de uso de IA no seu setor 👇"
   → Anexa PDF do setor do lead

2. WhatsApp de lembrete (24h antes)
   "Olá [Nome], nossa conversa é amanhã às [hora].
    Estou animado para entender melhor os desafios da [empresa]!"

3. WhatsApp de lembrete (1h antes)
   "Nossa conversa começa em 1 hora. Aqui está o link:
    [Google Meet link]"

4. CRM atualizado automaticamente (HubSpot)
   - Lead criado/atualizado
   - Deal criado na pipeline

5. E-mail de follow-up (2h após a reunião)
   "Foi ótimo conversar! Vou preparar uma proposta
    personalizada para a [empresa] até [data + 2 dias]."
```

### 4.3 — Pipeline de Vendas Automatizado

```
ETAPA 1: Awareness
  Lead viu conteúdo no LinkedIn / Google
  → Pixel captura → Re-targeting automático

ETAPA 2: Interesse
  Lead entrou no site / clicou no CTA
  → Chatbot Ada ativa imediatamente

ETAPA 3: Qualificação
  Ada qualifica: setor, dor, orçamento
  → Score automático no HubSpot

ETAPA 4: Agendamento
  Ada oferece diagnóstico → Link Cal.com
  → Confirmação automática (e-mail + WhatsApp)

ETAPA 5: Diagnóstico (ÚNICA AÇÃO MANUAL)
  30 min de reunião via Google Meet
  → Você ouve, faz perguntas, entende o contexto

ETAPA 6: Proposta
  IA gera rascunho da proposta com base no diagnóstico
  → Você revisa em 15 minutos → Envia via PandaDoc

ETAPA 7: Follow-up
  Sequência automática de 5 e-mails em 14 dias
  → Se não fechar: lead vai para nutrição de 90 dias

ETAPA 8: Fechamento
  Contrato via DocuSign (assinatura eletrônica)
  → Onboarding automático disparado
```

---

## PARTE 5 — STACK COMPLETA E CUSTOS

### 5.1 — Ferramentas por Categoria

**Marketing de Conteúdo:**
- Claude API — geração de textos: ~$50/mês
- Canva Pro — design: R$54/mês
- Make.com — automação de publicação: $16/mês
- Brevo — e-mail marketing: R$0 (plano gratuito)

**Prospecção Ativa:**
- Apollo.io — banco de leads: $49/mês
- Clay.com — enriquecimento com IA: $149/mês
- Instantly.ai — cold email: $37/mês

**Chatbot e Atendimento:**
- Claude API — IA do chatbot: ~$80/mês
- n8n (VPS Hetzner) — orquestrador: ~R$50/mês
- Z-API — WhatsApp Business: R$97/mês
- Chatwoot — widget do site: R$0 (open source)

**CRM e Vendas:**
- HubSpot — CRM: R$0 (plano gratuito)
- Cal.com — agenda: $12/mês
- PandaDoc — propostas: $19/mês
- DocuSign — contratos: $25/mês

**Total estimado: ~R$2.200/mês**
**ROI: 1 cliente de R$15k/mês já paga todo o sistema 7x**

---

## PARTE 6 — PLANO DE EXECUÇÃO (90 DIAS)

### Mês 1 — Fundação
```
Semana 1-2:
  ✅ Configurar Cal.com (terça/quinta/sábado 9h-16h)
  ✅ Conectar Cal.com ao Google Meet
  ✅ Configurar HubSpot CRM (gratuito)
  ✅ Criar conta Apollo.io e montar ICP
  ✅ Instalar Chatwoot no servidor

Semana 3-4:
  ✅ Construir chatbot Ada no n8n + Claude API
  ✅ Conectar Ada ao WhatsApp (Z-API)
  ✅ Instalar widget Chatwoot no site Adone AI
  ✅ Criar as primeiras 3 sequências de e-mail no Brevo
  ✅ Configurar Make.com para publicar no LinkedIn/Instagram
```

### Mês 2 — Ativação
```
  ✅ Lançar prospecção ativa: 100 empresas/semana via Apollo + Instantly
  ✅ Publicar 8 posts no LinkedIn (2/semana, gerados por IA)
  ✅ Criar 1 e-book PDF para o setor mais promissor (varejo/logística)
  ✅ Rodar 1 webinar gratuito ao vivo (diagnóstico ao vivo)
  ✅ Primeira proposta enviada via PandaDoc
  Meta: 10 diagnósticos agendados
```

### Mês 3 — Otimização e Escala
```
  ✅ Analisar quais setores converteram mais → dobrar aposta
  ✅ Criar conteúdo específico por setor (varejo, logística, saúde)
  ✅ Ativar re-targeting pago (Meta Ads / LinkedIn Ads) com R$1.500/mês
  ✅ Automatizar proposta (IA gera rascunho com base no diagnóstico)
  ✅ Contratar 1 SDR (pré-vendas) se volume > 20 leads/semana
  Meta: 2 clientes fechados (R$30k+ MRR)
```

---

## RESUMO EXECUTIVO

> "Você não precisa falar com ninguém para vender. Você precisa que o sistema certo fale por você." — Adaptado de Flávio Augusto

| Função | Responsável |
|---|---|
| Encontrar empresas | Apollo.io + Clay.com (automático) |
| Primeiro contato | Instantly.ai cold email (automático) |
| Qualificar lead | Chatbot Ada — Claude API (automático) |
| Agendar reunião | Ada + Cal.com (automático) |
| Lembrete de reunião | n8n + WhatsApp (automático) |
| Diagnóstico | **VOCÊ** (30 min, 3 dias/semana) |
| Proposta | IA gera rascunho + você revisa (15 min) |
| Follow-up pós-reunião | n8n + Brevo (automático) |
| Contrato | DocuSign (automático) |
| Nutrição de leads frios | Brevo sequências (automático) |

**Sua dedicação necessária: ~3 horas por semana de vendas.**
**O resto: 100% automatizado.**
