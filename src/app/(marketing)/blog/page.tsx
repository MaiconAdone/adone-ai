import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Background, Container, Wrapper } from "@/components";
import { SectionBadge } from "@/components/ui/section-bade";
import { BlogCoverEditor } from "@/components/marketing/blog-cover-editor";
import { getPublishedPosts } from "@/lib/engine/marketing/blog";

// Artigo aprovado na planilha aparece em até 10 minutos, sem novo deploy
export const revalidate = 600;

export const metadata: Metadata = {
    title: "Blog — IA sem mistério para o seu negócio",
    description: "Artigos da Adone Intelligence sobre Inteligência Artificial e Machine Learning aplicados a empresas: previsão de demanda, automação, dados e como começar.",
};

const BlogPage = async () => {
    const posts = await getPublishedPosts();

    return (
        <Background>
            <Wrapper className="relative pt-32 pb-20">
                <Container>
                    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
                        <SectionBadge title="Blog" />
                        <h1 className="text-3xl md:text-5xl font-heading font-semibold !leading-snug mt-6">
                            IA sem mistério{" "}
                            <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
                                para o seu negócio
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-accent-foreground/70 mt-4">
                            Como empresas usam Inteligência Artificial e Machine Learning para resolver problemas reais — explicado sem jargão.
                        </p>
                    </div>
                </Container>

                <Container delay={0.1} className="mt-12">
                    {posts.length === 0 ? (
                        <p className="text-center text-muted-foreground">Os primeiros artigos estão chegando em breve.</p>
                    ) : (
                        <div className="max-w-4xl mx-auto grid gap-4 md:grid-cols-2">
                            {posts.map(post => (
                                <div key={post.slug} className="relative h-full">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="group block h-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/[0.02] hover:border-brand-500/30 transition-colors"
                                    >
                                        {post.imageId && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={`/blog/imagem/${post.imageId}`}
                                                alt=""
                                                width={1536}
                                                height={1024}
                                                loading="lazy"
                                                className="aspect-[3/2] w-full object-cover"
                                            />
                                        )}
                                        <div className="p-6">
                                            <p className="text-xs text-muted-foreground">
                                                {post.date}{post.sector ? ` · ${post.sector}` : ""}
                                            </p>
                                            <h2 className="mt-2 text-lg font-semibold text-foreground group-hover:text-brand-800 transition-colors">
                                                {post.title}
                                            </h2>
                                            <p className="mt-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
                                            <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-700">
                                                Ler artigo <ArrowRight className="ml-1 h-4 w-4" />
                                            </span>
                                        </div>
                                    </Link>
                                    {/* Fora do link: cliques na janela de troca não abrem o artigo */}
                                    <BlogCoverEditor
                                        slug={post.slug}
                                        title={post.title}
                                        hasImage={Boolean(post.imageId)}
                                        className="absolute right-3 top-3"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </Container>
            </Wrapper>
        </Background>
    );
};

export default BlogPage;
