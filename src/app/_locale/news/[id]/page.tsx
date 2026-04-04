import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProgressBar } from "@/components/ProgressBar";
import Image from "next/image";
import { fetchPosts, fetchPost, getFeaturedImage } from "@/lib/wp";
import { notFound } from "next/navigation";

export default async function NewsDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const post = await fetchPost(resolvedParams.id);

    if (!post) {
        notFound();
    }

    // Extract metadata from post if available (some might be in the content as HTML from the worker)
    const dateStr = new Date(post.date).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\//g, '.');

    return (
        <main className="min-h-screen bg-zinc-50 pb-24">
            <ProgressBar />
            <Header />

            {/* Hero */}
            <div className="w-full bg-zinc-100 relative aspect-[21/9] max-w-none">
                <Image src={getFeaturedImage(post)} alt="News Cover" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12 z-10 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] uppercase font-black tracking-widest bg-zinc-950 px-4 py-1.5 shadow-lg">
                            World AI News
                        </span>
                        <span className="text-[11px] font-black tracking-widest text-zinc-300">
                            {dateStr}
                        </span>
                    </div>
                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-serif font-black leading-[1.2] tracking-tighter max-w-4xl text-white"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                </div>
            </div>

            <article className="mx-auto px-5 sm:px-6 pt-12 newspicks-wrapper">
                <div className="bg-white border border-zinc-200 shadow-xl p-6 sm:p-12 md:p-16 mb-24 space-y-16">
                    <header className="border-b-[3px] border-brand-accent pb-8 space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black uppercase tracking-widest bg-zinc-950 text-white px-3 py-1">WORLD NEWS</span>
                            <span className="text-[10px] text-zinc-300 font-black tracking-widest ml-auto">{dateStr}</span>
                        </div>
                    </header>

                    <section className="space-y-8">
                        <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-widest uppercase text-zinc-950 border-l-[6px] border-brand-accent pl-6 pb-1 underline underline-offset-[12px] decoration-4 decoration-brand-accent">
                            インテリジェンス概要
                        </h2>
                        <div
                            className="prose prose-zinc max-w-none prose-p:text-[16px] sm:prose-p:text-[18px] prose-p:leading-[2.0] prose-p:tracking-[0.03em] prose-p:mb-10 text-zinc-800 prose-strong:text-zinc-950 prose-strong:font-black prose-strong:bg-yellow-100/50 prose-blockquote:bg-zinc-50 prose-blockquote:p-6 sm:prose-blockquote:p-8 prose-blockquote:border-l-[6px] prose-blockquote:border-brand-accent prose-blockquote:my-10 prose-blockquote:not-italic prose-blockquote:font-medium newspicks-prose"
                            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                        />
                    </section>
                </div>
            </article>
            <BottomNav />
        </main>
    );
}

export async function generateStaticParams() {
    try {
        const posts = await fetchPosts(100, 1); // Category 1: News
        if (!posts || posts.length === 0) return [{ id: 'dummy' }];
        return posts.map((post: any) => ({
            id: post.id.toString(),
        }));
    } catch (e) {
        return [{ id: 'dummy' }];
    }
}
