// Acervo "Projetos em Madeira": 75 PDFs únicos (2.140 páginas), classificados pelo conteúdo real de cada arquivo.
// Os arquivos ficam no Google Drive da Adone; o link é entregue depois do pagamento.

export type Idioma = "PT" | "ES" | "EN";

export interface ProjetoPdf {
    titulo: string;
    paginas: number;
    resumo: string;
    idioma?: Idioma; // padrão PT
    destaque?: boolean;
}

export interface CategoriaProjetos {
    id: string;
    nome: string;
    chamada: string;
    descricao: string;
    nivel: string;
    capas: string[]; // imagens em /public/projetos-madeira
    projetos: ProjetoPdf[];
}

export const PRECO_ACERVO = "19,90";

// Troque pelo link do checkout (Kiwify, Hotmart, Mercado Pago...) quando estiver pronto.
export const CHECKOUT_URL =
    "https://wa.me/5511926025637?text=Quero%20o%20acervo%20Projetos%20em%20Madeira%20por%20R%24%2019%2C90";

export const CATEGORIAS: CategoriaProjetos[] = [
    {
        id: "gourmet",
        nome: "Áreas gourmet, fogões a lenha e cozinhas caipiras",
        chamada: "Tijolo por tijolo",
        descricao:
            "Projetos de alvenaria rústica com planta, vistas, medidas e lista de materiais calculada: fogões a lenha, churrasqueiras, fornos, bancadas, pias e espaços completos de lazer.",
        nivel: "Obra de alvenaria",
        capas: ["areas-gourmet", "cozinhas-caipiras", "bancadas-pias", "churrasqueira", "cantinho-cachaca"],
        projetos: [
            { titulo: "30 projetos rústicos de fogão + manual", paginas: 69, resumo: "Churrasqueiras, fogões a lenha e fornos com mapa de fiadas e passo a passo.", destaque: true },
            { titulo: "Fogão a lenha: projetos 31 a 42 — áreas gourmet completas", paginas: 69, resumo: "12 espaços gourmet com planta, vista, materiais, pontos de água e luz.", destaque: true },
            { titulo: "Catálogo Cozinhas Caipiras — 12 projetos", paginas: 27, resumo: "Cozinhas rústicas com materiais, detalhes construtivos e montagem." },
            { titulo: "Bancadas e pias rústicas — 16 módulos completos", paginas: 53, resumo: "Módulos de bancada e pia em alvenaria com medidas e acabamento." },
            { titulo: "Cantinho da Cachaça", paginas: 45, resumo: "Bares rústicos, adegas e balcões com montagem passo a passo." },
            { titulo: "Bônus: calculadora de tijolos", paginas: 5, resumo: "Estime tijolos por área, desconte vãos e calcule a margem de perda." },
            { titulo: "Bônus: checklist de materiais da obra", paginas: 7, resumo: "Organize a compra e confira o que precisa estar na obra em cada etapa." },
        ],
    },
    {
        id: "industriais",
        nome: "Móveis industriais: madeira + ferro",
        chamada: "+650 ideias",
        descricao:
            "O guia mais volumoso do acervo: mesas, estantes, aparadores, racks, bancos e prateleiras no estilo industrial, com lista de peças, medidas e fotos.",
        nivel: "Marcenaria + serralheria",
        capas: ["industriais-350", "industriais-guia", "industriais-interna"],
        projetos: [
            { titulo: "Guia definitivo: +300 ideias de móveis industriais (parte 1)", paginas: 345, resumo: "Combinações de madeira e ferro para sala, cozinha, quarto e escritório.", destaque: true },
            { titulo: "+350 projetos de móveis industriais (parte 2)", paginas: 342, resumo: "Mesas de jantar, estantes, armários e mais, com lista de peças e medidas.", destaque: true },
        ],
    },
    {
        id: "marcenaria",
        nome: "Marcenaria com plano de corte",
        chamada: "Medidas e peças",
        descricao:
            "Projetos técnicos com vistas, cotas, lista de peças e recortes: armários, cozinhas planejadas, gaveteiros, mesas de trabalho e um curso básico para começar do zero.",
        nivel: "Do iniciante ao avançado",
        capas: ["projeto-marcenaria", "marcenaria-interna", "gavetero", "mesa-carpintaria", "armario-duas-portas", "mesa-gaveteiros", "armario-banheiro", "cozinha-planejada", "projetos-madeira"],
        projetos: [
            { titulo: "Curso de marcenaria básico", paginas: 97, resumo: "Ferramentas, colagem, laminação e técnicas ilustradas passo a passo.", destaque: true },
            { titulo: "Projeto Marcenaria", paginas: 102, resumo: "Adega de parede, armários e nichos com recorte detalhado de cada peça.", destaque: true },
            { titulo: "30 planos de gaveteiros de madeira", paginas: 93, resumo: "30 gaveteiros com vistas cotadas e dimensões.", idioma: "ES" },
            { titulo: "30 planos de mesas de carpintaria", paginas: 66, resumo: "30 bancadas de trabalho para oficina, com desenho técnico.", idioma: "ES" },
            { titulo: "Projetos em madeira", paginas: 36, resumo: "Armário 3 portas, prateleira organizadora, roda-gigante de cachepôs e mesa de jantar." },
            { titulo: "Projeto cozinha planejada", paginas: 20, resumo: "Módulos de cozinha planejada com medidas." },
            { titulo: "Armário e gabinete para banheiro", paginas: 16, resumo: "Armário aéreo e gabinete com lista de peças." },
            { titulo: "Armário de duas portas", paginas: 15, resumo: "Projeto simples, executável em cerca de 12 horas." },
            { titulo: "Cozinha Arancibia (português + espanhol)", paginas: 24, resumo: "Cozinha de 2 módulos assinada por designers, nas duas línguas." },
            { titulo: "Mesa com gaveteiros", paginas: 10, resumo: "Mesa de trabalho com dois gaveteiros de 4 gavetas." },
            { titulo: "Cadeira Adirondack com apoio para os pés", paginas: 7, resumo: "Cadeira de descanso espaçosa com banqueta." },
            { titulo: "Centro de entretenimento Arona", paginas: 6, resumo: "Rack moderno para TV e som.", idioma: "ES" },
            { titulo: "Mesa para TV", paginas: 4, resumo: "Mesa de linhas simples para TV e equipamento de áudio.", idioma: "ES" },
        ],
    },
    {
        id: "quarto",
        nome: "Paletes no quarto: camas e cabeceiras",
        chamada: "10 projetos",
        descricao:
            "Camas de casal, infantis, de plataforma e até de balanço, além de cabeceiras rústicas — tudo com paletes e poucas ferramentas.",
        nivel: "Iniciante",
        capas: ["cama-paletes", "cama-balanco"],
        projetos: [
            { titulo: "Cama de casal com 8 paletes", paginas: 3, resumo: "Montagem da cama de casal com 8 paletes." },
            { titulo: "Cama com cabeceira feita com 6 europallets", paginas: 3, resumo: "Cama completa usando só 6 paletes." },
            { titulo: "Cama de paletes plataforma", paginas: 3, resumo: "Cama baixa estilo plataforma." },
            { titulo: "Cama de paletes rápida", paginas: 4, resumo: "Solução prática sem muitas ferramentas." },
            { titulo: "Cama simples com paletes", paginas: 2, resumo: "Projeto de encaixe direto." },
            { titulo: "Cama infantil de paletes", paginas: 10, resumo: "Cama baixa para criança, passo a passo com fotos." },
            { titulo: "Pallet bed: cama DIY", paginas: 5, resumo: "Cama de paletes contada por quem fez." },
            { titulo: "Cama de balanço de paletes", paginas: 7, resumo: "Cama suspensa para varanda ou jardim." },
            { titulo: "Cabeceira de cama rústica", paginas: 4, resumo: "Cabeceira com madeira de palete." },
            { titulo: "Como construir uma boa cabeceira", paginas: 4, resumo: "Processo de construção da cabeceira." },
        ],
    },
    {
        id: "sala",
        nome: "Paletes na sala: sofás, mesas, bar e decoração",
        chamada: "15 projetos",
        descricao:
            "Sofás, mesas de centro e de jantar, recanto de leitura, um bar completo e técnicas de acabamento como transfer de imagem e pintura de letras.",
        nivel: "Iniciante a intermediário",
        capas: ["man-cave", "mesa-centro", "apartamento"],
        projetos: [
            { titulo: "Bar de paletes \"man cave\" com planos", paginas: 19, resumo: "Balcão de bar completo, com planos de construção.", destaque: true },
            { titulo: "Mesa de jantar de paletes em 10 passos", paginas: 21, resumo: "Mesa de jantar econômica, passo a passo." },
            { titulo: "Pufe estofado de paletes", paginas: 24, resumo: "Otomano com rodízios e estofado, com tutorial." },
            { titulo: "Mesa de centro com rodas", paginas: 9, resumo: "Mesa de centro grande para sala de estar." },
            { titulo: "Mesa de café de paletes", paginas: 10, resumo: "Mesa de centro com madeira reaproveitada." },
            { titulo: "Mesa de centro elegante", paginas: 4, resumo: "Mesa de centro com acabamento refinado." },
            { titulo: "Mesa de pallet", paginas: 7, resumo: "Projeto simples e fácil de fazer." },
            { titulo: "Projeto da mesa de paletes", paginas: 3, resumo: "Desenho da mesa com medidas." },
            { titulo: "Sofá de pallet: dicas e passo a passo", paginas: 6, resumo: "Desafios e montagem com fotos." },
            { titulo: "Sofá Cheap'n'Chic", paginas: 5, resumo: "Sofá barato e bonito com paletes." },
            { titulo: "Como fixar o encosto de um sofá de paletes", paginas: 9, resumo: "A técnica que resolve o ponto mais difícil do sofá." },
            { titulo: "Recanto de leitura com duas paletes (partes 1 e 2)", paginas: 14, resumo: "Poltrona de leitura em duas etapas." },
            { titulo: "Apartamento industrial com móveis de paletes", paginas: 8, resumo: "Inspiração de decoração completa." },
            { titulo: "Caixote de paletes com transfer de imagem", paginas: 30, resumo: "Caixote decorativo e transferência de imagem fácil." },
            { titulo: "Como pintar letras em madeira de paletes", paginas: 6, resumo: "Técnicas e dicas de pintura de letras." },
        ],
    },
    {
        id: "jardim",
        nome: "Paletes no jardim e na área externa",
        chamada: "18 projetos + 70 ideias",
        descricao:
            "Sofás de varanda, bancos, mesas, cadeiras, jardins verticais, floreiras e até um parque infantil para quem quer transformar o quintal.",
        nivel: "Iniciante a intermediário",
        capas: ["sofa-externo", "jardim-vertical", "floreiras", "adirondack", "parque-infantil"],
        projetos: [
            { titulo: "50 ideias com paletes para o jardim", paginas: 55, resumo: "Coletânea de projetos para quintal e varanda.", destaque: true },
            { titulo: "Móveis de pallet: makeover do pátio", paginas: 35, resumo: "Conjunto de móveis externos construído do zero.", destaque: true },
            { titulo: "Banco de paletes e mesa com gabião", paginas: 30, resumo: "Banco e mesa externa com pedras." },
            { titulo: "20 ideias de floreiras com paletes", paginas: 20, resumo: "Floreiras para dentro e fora de casa." },
            { titulo: "Mobiliário de pátio com paletes", paginas: 19, resumo: "Sofá e mesa para área externa." },
            { titulo: "Cadeira Adirondack de pallet", paginas: 19, resumo: "Guia ilustrado de montagem.", idioma: "EN" },
            { titulo: "Sofá externo de pallet", paginas: 15, resumo: "Sofá para deck ou varanda." },
            { titulo: "Poltrona e sofá externo", paginas: 13, resumo: "Transformação de varanda com sofá de paletes." },
            { titulo: "Jardim vertical reciclado", paginas: 10, resumo: "Jardim vertical faça você mesmo." },
            { titulo: "Jardim vertical eco-friendly", paginas: 10, resumo: "Materiais, plantas e montagem." },
            { titulo: "Jardim vertical em um palete", paginas: 2, resumo: "Instruções rápidas.", idioma: "EN" },
            { titulo: "Mesa de jardim elegante e econômica", paginas: 7, resumo: "Mesa externa com paletes." },
            { titulo: "Mesa de jardim com rodas", paginas: 3, resumo: "Mesa externa móvel." },
            { titulo: "Mesa de suculentas", paginas: 6, resumo: "Mesa-canteiro para o jardim." },
            { titulo: "Banco de envasamento (potting)", paginas: 6, resumo: "Bancada funcional para jardinagem." },
            { titulo: "Sofá de jardim com planos em 3D", paginas: 4, resumo: "Sofá com chaise e planos em 3D." },
            { titulo: "Cama de pátio", paginas: 4, resumo: "Cama-sofá para área externa." },
            { titulo: "Parque de diversões com paletes", paginas: 3, resumo: "Brinquedos de quintal para crianças." },
        ],
    },
    {
        id: "guias",
        nome: "Cursos, guias e coletâneas de paletes",
        chamada: "Comece por aqui",
        descricao:
            "Curso de móveis com paletes, onde conseguir paletes de graça, como tratar a madeira e coletâneas com dezenas de ideias e tutoriais.",
        nivel: "Base para todos",
        capas: ["moveis-palets", "rusticos-paletes", "rusticos-interna", "50-ideias"],
        projetos: [
            { titulo: "Móveis com paletes: curso e guia prático", paginas: 34, resumo: "Do zero ao primeiro móvel, com passo a passo.", destaque: true },
            { titulo: "10 projetos rústicos com paletes", paginas: 31, resumo: "Bares, mesas, assentos e armários com materiais, montagem e medidas.", destaque: true },
            { titulo: "50 ideias de móveis com paletes e tutoriais", paginas: 50, resumo: "Espreguiçadeiras, sofás, mesas e muito mais." },
            { titulo: "30 planos e projetos com paletes", paginas: 30, resumo: "Ideias de mobiliário para quem quer economizar." },
            { titulo: "17 móveis com paletes de madeira", paginas: 19, resumo: "Móveis econômicos para mobiliar a casa." },
            { titulo: "Ecodesign: paletes em design de interiores", paginas: 21, resumo: "Estudo acadêmico sobre o uso do palete em projetos." },
            { titulo: "Madeira de palete: desafios e dicas", paginas: 11, resumo: "Onde achar, como escolher e preparar a madeira." },
            { titulo: "Onde encontrar paletes de madeira", paginas: 5, resumo: "Os melhores lugares para conseguir paletes." },
        ],
    },
];

export const TOTAL_PDFS = CATEGORIAS.reduce((n, c) => n + c.projetos.length, 0);
export const TOTAL_PAGINAS = CATEGORIAS.reduce((n, c) => n + c.projetos.reduce((s, p) => s + p.paginas, 0), 0);
