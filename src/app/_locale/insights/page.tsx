import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";
import Image from "next/image";
import { fetchPosts } from "@/lib/wp";

export default async function InsightsIndex() {
    const posts = await fetchPosts(20, 27);

    return (
        <main className="min-h-screen pb-24 bg-white">
            <Header />
            <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
                <div className="space-y-3 border-b border-zinc-100 pb-8">
                    <h1 className="text-5xl font-serif font-black tracking-tighter border-b-8 border-brand-accent pb-2 inline-block">インサイト</h1>
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.4em] text-xs">Deep Analysis & Strategic Intelligence from the Frontier 8</p>
                </div>

                <div className="grid grid-cols-1 gap-0">
                    {posts.map((post: any) => {
                        const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url;
                        return (
                            <Link key={post.id} href={`/insights/${post.id}`} className="block group border-b border-zinc-100 last:border-none">
                                <div className="flex gap-6 py-8 items-start">
                                    {featuredImage && (
                                        <div className="relative aspect-video w-44 md:w-56 flex-shrink-0 overflow-hidden rounded-none bg-zinc-100 border border-zinc-100">
                                            <Image
                                                src={featuredImage}
                                                alt={post.title.rendered}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 space-y-2 min-w-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] font-black tracking-[0.2em] text-brand-accent uppercase bg-brand-accent/5 px-2 py-0.5">
                                                STRATEGIC INSIGHT
                                            </span>
                                            <span className="text-[10px] text-zinc-300 font-black tracking-[0.2em] uppercase">
                                                {new Date(post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                                            </span>
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-black text-zinc-800 group-hover:text-zinc-950 transition-colors leading-snug tracking-tight line-clamp-2" dangerouslySetInnerHTML={{ __html: post.title.rendered }}></h2>
                                        {post.excerpt?.rendered && (
                                            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 font-medium" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered.replace(/<[^>]*>/g, '') }}></p>
                                        )}
                                        <div className="pt-2 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-zinc-300 group-hover:text-brand-accent transition-all uppercase">
                                            分析を読む
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <BottomNav />
        </main>
    );
}
