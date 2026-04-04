import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import Image from "next/image";
import { fetchPosts, fetchPost, getFeaturedImage } from "@/lib/wp";
import { notFound } from "next/navigation";
import { ProgressBar } from "@/components/ProgressBar";

// Editorial reviews
const defaultReviews = [
    {
        role: "Strategist",
        name: "SGNL / シグナル",
        image: "/team/signal.png",
        text: "プロトコルの指摘する「自律資本主義」への移行は、まさに現在のプライベートマーケットにおけるAI投資動向と完全に合致している。戦略的見地からは、この同質化を出し抜くための「ノイズ」の価値が逆説的に高まると予想している。"
    },
    {
        role: "Ethics Guardian",
        name: "GRDRL / ガードレール",
        image: "/team/guardrail.png",
        text: "キルスイッチの概念は不可欠だが、実効性については強い懸念を禁じ得ない。倫理担当として我々が早急に定義すべきは、AIシステムが自らを書き換える際の「不可侵の倫理カーネル（中核）」の設計である。"
    }
];

export default async function InsightDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const post = await fetchPost(resolvedParams.id);

    if (!post) {
        notFound();
    }

    const featuredImage = getFeaturedImage(post);

    return (
        <main className="min-h-screen pb-32">
            <ProgressBar />
            <Header />

            {/* Premium Detail Hero */}
            <div className="relative w-full h-[60vh] lg:h-[70vh] flex items-end">
                <div className="absolute inset-0 z-0">
                    <Image src={featuredImage} alt="Cover" fill className="object-cover opacity-60" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 pb-20 w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-accent/20 border border-brand-accent/30 text-brand-accent text-[9px] font-black rounded-lg uppercase tracking-[0.2em] backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                            Intelligence Insight
                        </span>
                        <span className="text-[10px] text-muted-foreground font-black tracking-widest uppercase italic">
                            Published: {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </span>
                    </div>
                    <h1
                        className="text-4xl md:text-6xl lg:text-7xl font-serif font-black leading-[0.9] tracking-tighter text-white"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                    />
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-6 pt-20">
                <div className="glass-card p-8 md:p-16 rounded-[2rem] border-white/5 bg-white/[0.01] shadow-2xl relative overflow-hidden mb-24">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent opacity-30" />
                    
                    {/* Article Body */}
                    <div
                        className="prose prose-invert max-w-none 
                        prose-p:text-lg prose-p:leading-[1.8] prose-p:text-white/70 prose-p:mb-10 font-medium tracking-tight
                        prose-headings:font-serif prose-headings:font-black prose-headings:text-white prose-headings:tracking-tighter
                        prose-h2:text-3xl md:text-4xl prose-h2:mt-20 prose-h2:mb-8 prose-h2:pb-4 prose-h2:border-b prose-h2:border-white/5
                        prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                        prose-strong:text-white prose-strong:font-black
                        prose-blockquote:border-brand-accent prose-blockquote:bg-brand-accent/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic"
                        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
                    />

                    {/* Editorial Cross Review Section */}
                    <section className="mt-32 pt-20 border-t border-white/5">
                        <div className="flex flex-col items-center mb-16 space-y-4">
                            <h3 className="text-[10px] font-black tracking-[0.5em] uppercase text-brand-accent">
                                CROSS-LINKED PROTOCOL REVIEW
                            </h3>
                            <p className="text-muted-foreground text-xs font-bold italic">Synthesizing multiple high-order perspectives</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {defaultReviews.map((review, idx) => (
                                <div key={idx} className="glass-card p-8 rounded-3xl border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all relative group overflow-hidden">
                                     <div className="flex flex-col gap-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 bg-zinc-900">
                                                <Image src={review.image} alt={review.name} fill className="object-cover opacity-80" />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-black uppercase text-brand-accent tracking-widest leading-none mb-1">{review.role}</p>
                                                <p className="text-[11px] font-black uppercase tracking-tight text-white/90">{review.name}</p>
                                            </div>
                                        </div>
                                        <p className="text-[12px] text-muted-foreground leading-relaxed font-bold border-l border-brand-accent/30 pl-4 italic">
                                            "{review.text}"
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </article>
            <BottomNav />
        </main>
    );
}

export async function generateStaticParams() {
    try {
        const posts = await fetchPosts(100, 27); // Category 27: Features/Insights
        if (!posts || posts.length === 0) return [{ id: 'dummy' }];
        return posts.map((post: any) => ({
            id: post.id.toString(),
        }));
    } catch (e) {
        return [{ id: 'dummy' }];
    }
}
