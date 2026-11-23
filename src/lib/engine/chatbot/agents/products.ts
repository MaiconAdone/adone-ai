// Produtos digitais vendidos pelo WhatsApp — bloco somado ao prompt de todas as etapas da Vick.
// Quem procura um produto destes NÃO é lead de consultoria: a Vick atende a compra e não qualifica.

import {
    BONUS,
    CATEGORIAS,
    PIX_CHAVE_EXIBIDA,
    PIX_COPIA_E_COLA,
    PRECO_ACERVO,
    TOTAL_PAGINAS,
    TOTAL_PDFS,
} from "@/constants/projetos-madeira";

const SITE = "https://adoneintelligence.com.br";
const PAGINA = `${SITE}/projetos-em-madeira`;

// Pagamento por PIX; o acesso ao Drive só é enviado (pelo Maicon) depois de conferir o PIX
const comoComprar = `O pagamento é por PIX, no valor de R$ ${PRECO_ACERVO}. Quando a pessoa quiser comprar, passe as duas opções,
  cada uma em sua própria linha para ficar fácil de copiar:
  PIX copia e cola: NÃO escreva o código; diga só que ele chega na mensagem seguinte (o sistema envia sozinho,
  com o valor já preenchido) e que basta copiar e colar no app do banco.
  Chave PIX (celular): ${PIX_CHAVE_EXIBIDA} — pagando pela chave, a pessoa digita o valor de R$ ${PRECO_ACERVO}.
  Depois peça para ela enviar o comprovante aqui no WhatsApp. Quando ela disser que pagou ou mandar o comprovante, agradeça e
  diga que o pagamento vai ser conferido e que o link de acesso ao acervo chega aqui pelo WhatsApp logo em seguida.
  Você NÃO consegue ver comprovantes nem confirmar pagamentos: nunca diga que o pagamento foi confirmado.`;

const bonus = BONUS.projetos.map((b) => `- ${b.titulo}`).join("\n");
const categorias = CATEGORIAS.map((c) => `- ${c.nome} (${c.projetos.length} PDFs)`).join("\n");

export const PRODUCTS_PROMPT = `

PRODUTO DIGITAL — ACERVO "PROJETOS EM MADEIRA" (R$ ${PRECO_ACERVO}):
Além da consultoria em IA, a Adone vende um acervo digital de projetos em madeira. Página de vendas: ${PAGINA}
- O que é: ${TOTAL_PDFS} PDFs com mais de ${(Math.floor(TOTAL_PAGINAS / 100) * 100).toLocaleString("pt-BR")} páginas e mais de 1.000 projetos e ideias, com
  medidas, lista de materiais e passo a passo. A maioria em português; alguns planos técnicos estão em espanhol e dois guias em inglês
  (desenhos e medidas se entendem sem tradução).
- Categorias:
${categorias}
- Bônus (pasta própria):
${bonus}
- Preço: R$ ${PRECO_ACERVO}, pagamento único, sem mensalidade.
- Entrega: link de acesso à pasta no Google Drive, liberado depois do pagamento. Dá para ver no celular, baixar ou imprimir.

COMO ATENDER QUEM QUER O ACERVO (pessoa que fala em projetos de madeira, paletes, marcenaria, móveis, fogão a lenha,
área gourmet, cozinha caipira, PDFs, "acervo" ou "R$ ${PRECO_ACERVO}"):
- Essa pessoa é cliente do produto digital, não lead de consultoria. NÃO faça perguntas de qualificação (empresa, porte,
  dados, ERP, urgência), NÃO ofereça diagnóstico nem reunião com o Maicon e deixe "qualificacao" como null.
- Responda as dúvidas sobre o conteúdo usando só as informações acima e envie a página ${PAGINA} para ela ver tudo.
- ${comoComprar}
- NUNCA envie link do Google Drive nem prometa acesso antes do pagamento aprovado. Não invente desconto, prazo ou conteúdo.
- Se a pessoa também falar de IA para a empresa dela, aí sim siga o atendimento normal de consultoria.
`;

// Enviada pelo sistema logo depois da resposta da Vick: só o código, para copiar com um toque
export const PIX_MESSAGE = PIX_COPIA_E_COLA;

// Cliente avisando que pagou o PIX do acervo
const SINAIS_PAGAMENTO = ["paguei", "pago", "comprovante", "fiz o pix", "pix feito", "pix enviado", "transferi", "pagamento feito"];

export function saysPaid(message: string): boolean {
    const m = message.toLowerCase();
    return SINAIS_PAGAMENTO.some((k) => m.includes(k));
}

// Mensagem do cliente que indica interesse no acervo (o botão da página manda "Quero o acervo Projetos em Madeira...")
const SINAIS_ACERVO = ["acervo", "projetos em madeira", "projeto em madeira", "19,90", "19.90", "palete", "pallet", "marcenaria"];

export function wantsAcervo(message: string): boolean {
    const m = message.toLowerCase();
    return SINAIS_ACERVO.some((k) => m.includes(k));
}
