import { DynamicPostFeed } from "@/components/DynamicPostFeed";
import Link from "next/link";

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isJa = locale === "ja";

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Hero Section */}
      <section className="py-20 md:py-32 flex flex-col items-center text-center space-y-12 relative overflow-hidden">
        {/* Animated Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-accent/5 blur-[120px] rounded-full -z-10 animate-pulse transition-all duration-[5000ms]" />
        
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-4 px-4 py-1.5 rounded-full bg-brand-accent/5 border border-brand-accent/20 text-brand-accent text-[10px] font-black tracking-[0.3em] uppercase animate-in fade-in slide-in-from-bottom-2 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
            </span>
            {isJa ? "新時代のAIポータル" : "NEW ERA AI PORTAL"}
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-white animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
            {isJa ? (
              <>
                知性のフロンティアを<br />
                <span className="text-brand-accent">目撃せよ。</span>
              </>
            ) : (
              <>
                WITNESS THE<br />
                <span className="text-brand-accent">FRONTIER.</span>
              </>
            )}
          </h1>
          
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium tracking-tight leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            {isJa 
              ? "AgentFrontierは、最新のAIエージェント、LLM、そして自動化技術の深淵を解読するプロフェッショナル・インテリジェンス・ターミナルです。"
              : "AgentFrontier is a professional intelligence terminal deciphering the abyss of AI agents, LLMs, and automation technologies."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <Link href={`/${locale}/getting-started`} className="px-10 py-4 bg-white text-black font-black text-xs tracking-[0.2em] uppercase hover:bg-brand-accent hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            {isJa ? "はじめる" : "GET STARTED"}
          </Link>
          <Link href={`/${locale}/tools`} className="px-10 py-4 bg-zinc-900 text-white font-black text-xs tracking-[0.2em] uppercase border border-white/5 hover:border-brand-accent/30 transition-all">
            {isJa ? "ツールカタログ" : "TOOL CATALOG"}
          </Link>
        </div>
      </section>

      {/* Main Content Feed */}
      <DynamicPostFeed />

      {/* Footer-like CTA */}
      <section className="py-32 mb-20 border-t border-white/5">
        <div className="bg-zinc-900/50 rounded-[40px] p-12 md:p-24 flex flex-col md:flex-row items-center justify-between gap-12 border border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/5 blur-[100px] -z-10 group-hover:bg-brand-accent/10 transition-colors" />
          
          <div className="space-y-6 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {isJa ? "AIの最前線へ、\nギルドに参加しませんか？" : "Join the Guild,\nFrontline of AI."}
            </h2>
            <p className="text-zinc-500 font-medium tracking-tight">
              {isJa 
                ? "最新のAI活用術、クローズドなコミュニティ、そして優先的なエージェント提供。あなたのビジネスを加速させます。"
                : "Latest AI use cases, closed community, and priority agent access. Accelerate your business."}
            </p>
          </div>
          
          <Link href={`/${locale}/guild`} className="px-12 py-5 bg-brand-accent text-white font-black text-xs tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all shadow-2xl">
            {isJa ? "ギルドに参加" : "JOIN THE GUILD"}
          </Link>
        </div>
      </section>
    </div>
  );
}
