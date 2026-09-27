import { MetadataRoute } from "next";
import { getPublishedPosts } from "@/lib/engine/marketing/blog";

// Inclui os artigos aprovados do blog; atualizado junto com o blog
export const revalidate = 600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const base = "https://adoneintelligence.com.br";
    const posts = await getPublishedPosts();

    return [
        {
            url: base,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${base}/agendar`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${base}/synapse`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${base}/privacidade`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${base}/termos`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${base}/dados`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${base}/lgpd`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${base}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        ...posts.map(post => ({
            url: `${base}/blog/${post.slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        })),
    ];
}
