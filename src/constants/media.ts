// Fotos e vídeos do site. Fotos: Unsplash (licença livre para uso comercial).
// Vídeos: arquivos locais em /public/videos.

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80`;

export const PHOTOS = {
    // Equipe e reuniões (a foto do "Como funciona" é local: /img/equipe-reuniao.webp)
    sunnyMeeting: unsplash("photo-1681949287382-052ea3954a51"),

    // Soluções
    consulting: unsplash("photo-1596496181871-9681eacf9764"),
    predictive: unsplash("photo-1542744173-05336fcc7ad4"),
    automation: unsplash("photo-1716191299980-a6e8827ba10b"),
    vision: unsplash("photo-1632914146475-bfe6fa6b2a12"),
    chatbots: unsplash("photo-1758874384722-ab97b4c9af89"),
    analytics: unsplash("photo-1608222351212-18fe0ec7b13b"),
    integration: unsplash("photo-1587620962725-abab7fe55159"),

    // Segmentos
    finance: unsplash("photo-1633158829585-23ba8f7c8caf"),
    retail: unsplash("photo-1758520387687-38a92a7ee42f"),
    industry: unsplash("photo-1610891015188-5369212db097"),
    health: unsplash("photo-1758691463569-66de91d76452"),
    logistics: unsplash("photo-1669003152272-c97a577284ad"),
    realEstate: unsplash("photo-1429497419816-9ca5cfb4571a"),
    insurance: unsplash("photo-1714974528703-e5ad41abc259"),
    legal: unsplash("photo-1521791055366-0d553872125f"),
    education: unsplash("photo-1524178232363-1fb2b075b655"),
    agro: unsplash("photo-1560493676-04071c5f467b"),
} as const;

export const VIDEOS = {
    hero: { src: "/videos/hero.mp4", mobileSrc: "/videos/hero-mobile.mp4", poster: "/videos/hero-poster.webp" },
    cta: { src: "/videos/cta.mp4", mobileSrc: "/videos/cta-mobile.mp4", poster: "/videos/cta-poster.webp" },
} as const;
