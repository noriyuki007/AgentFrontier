import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProgressBar } from "@/components/ProgressBar";
import Image from "next/image";
import { fetchPosts, fetchPost, getFeaturedImage } from "@/lib/wp";
import { notFound } from "next/navigation";

export default async function ReviewDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const post = await fetchPost(resolvedParams.id);

    if (!post) {
        notFound();
    }

    const dateStr = new Date(post.date).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, '.');

    return (
        <main className="min-h-screen bg-zinc-50 pb-24">
            <ProgressBar />
            <Header />

            <article className="mx-auto px-5 sm:px-6 pt-12 newspicks-wrapper">
                <div className="bg-white border border-zinc-200 shadow-xl p-6 sm:p-12 md:p-16 mb-24 space-y-16">

                    <header className="space-y-8 text-center border-b-[3px] border-brand-accent pb-12">
                        <div className="flex items-center justify-center gap-4">
                            <span className="text-[10px] uppercase font-black tracking-[0.4em] bg-zinc-100 text-zinc-950 px-3 py-1 border border-zinc-200">
                                Editorial Review
                            </span>
                            <span className="text-[10px] text-zinc-400 font-black tracking-widest uppercase">
                                REVIEW FILE · {dateStr}
                            </span>
                        </div>
                        <h1
                            className="text-4xl md:text-5xl font-serif font-black leading-tight tracking-tighter text-zinc-950"
                            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                        />
                    </header>

                    <div
                        className="prose prose-zinc max-w-none prose-p:text-[16px] sm:prose-p:text-[18px] prose-p:leading-[2.0] prose-p:tracking-[0.03em] prose-p:mb-12 text-zinc-800 prose-headings:font-serif prose-headings:font-black prose-h2:text-3xl sm:prose-h2:text-4xl prose-h2:mt-24 prose-h2:mb-10 prose-h2:border-l-[6px] prose-h2:border-brand-accent prose-h2:pl-6 prose-h2:pb-1 prose-h2:underline prose-h2:underline-offset-[12px] prose-h2:decoration-4 prose-h2:decoration-brand-accent prose-h3:text-2xl sm:prose-h3:text-3xl prose-h3:mt-16 prose-h3:mb-8 prose-h3:text-zinc-900 prose-strong:text-zinc-950 prose-strong:font-black prose-strong:bg-yellow-100/50 prose-blockquote:bg-zinc-50 prose-blockquote:p-6 sm:prose-blockquote:p-10 prose-blockquote:border-l-[6px] prose-blockquote:border-brand-accent prose-blockquote:my-12 prose-blockquote:not-italic prose-blockquote:font-medium prose-blockquote:text-zinc-800 prose-blockquote:leading-[2.0] newspicks-prose"
                        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                    />
                </div>
            </article>
            <BottomNav />
        </main>
    );
}

export async function generateStaticParams() {
    try {
        const posts = await fetchPosts(100, 25); // Category 25: Reviews
        if (!posts || posts.length === 0) {
            console.warn("No posts found for category 25. Returning a dummy ID to satisfy build.");
            return [{ id: 'dummy' }]; // Prevent export failure
        }
        return posts.map((post: any) => ({
            id: post.id.toString(),
        }));
    } catch (e) {
        return [{ id: 'dummy' }];
    }
}
