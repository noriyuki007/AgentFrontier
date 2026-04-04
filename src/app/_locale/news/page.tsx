import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import Link from "next/link";

const newsList = [
    {
        id: 1,
        source: "Bloomberg",
        title: "【独占】NVIDIAが放つ次世代プラットフォーム『Rubin』— 学習コスト1/10が変えるAI開発の経済学",
        body: "NVIDIAは次世代GPUアーキテクチャ『Rubin』を公式発表。大規模言語モデルの効率を飛躍させ、従来の世代比で電力とコストの劇的削減を実現する。AI投資の持続可能性を再定義する野心的プラットフォームの全容を解説する。",
        date: "2026.03.04",
        time: "2分前",
        tag: "HARDWARE",
    },
    {
        id: 2,
        source: "TechCrunch",
        title: "自律型エージェントの夜明け：OpenAIが水面下で進める新APIの破壊力",
        body: "開発者がより高度な推論と自律実行を行うエージェントを構築するためのツールセットを公開か。既存のAssistants APIを大幅に拡張し、真の自律エージェント構築を加速する次世代インターフェースの詳細が明らかになった。",
        date: "2026.03.04",
        time: "15分前",
        tag: "OPENAI",
    },
    {
        id: 3,
        source: "Forbes",
        title: "2028年の意思決定：AIエージェントが経営に浸透する「15%」の転換点",
        body: "Forbesのエグゼクティブ調査によれば、Fortune 500企業の15%が2028年末までにAIエージェントへの意思決定権の一部委譲を計画していることが判明。組織変革の臨界点とその対策を徹底分析する。",
        date: "2026.03.04",
        time: "1時間前",
        tag: "BUSINESS",
    },
    {
        id: 4,
        source: "WSJ",
        title: "対話型AIの最終統合。Apple・Google提携がもたらすプライバシーと推論の共存",
        body: "AppleとGoogleの異例のAI協力で、デバイス上でのオンデバイス推論とクラウドAIの完全な統合が視野に入ってきた。個人データを外部に送出しないまま、最高水準のAI推論を実現するアーキテクチャの革新を読み解く。",
        date: "2026.03.04",
        time: "3時間前",
        tag: "PRIVACY",
    },
    {
        id: 5,
        source: "Nikkei Asia",
        title: "日本企業がAI導入で直面する「実装の壁」—DX先進企業が明かす成功の法則",
        body: "経済産業省の最新調査で、AI活用に本格投資する日本企業は増加している一方、ROIを実感できている割合は30%に満たないことが発覚。成功企業と失敗企業を分ける「実装アーキテクチャの差」とは何か。",
        date: "2026.03.03",
        time: "1日前",
        tag: "JAPAN",
    },
    {
        id: 6,
        source: "MIT Tech Review",
        title: "推論モデルの新時代：「考える時間を与える」だけでAIはここまで賢くなる",
        body: "OpenAI o3、DeepSeek R1に続く「思考型AI」が次々と登場し、業界の競争軸が「モデルの大きさ」から「推論ステップの質と量」へと完全にシフトしている。Chain-of-Thoughtの進化と限界を解剖する。",
        date: "2026.03.03",
        time: "1日前",
        tag: "RESEARCH",
    },
];

export default function NewsIndex() {
    return (
        <main className="min-h-screen pb-24 bg-white">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
                <div className="space-y-3 border-b border-zinc-100 pb-8">
                    <h1 className="text-5xl font-serif font-black tracking-tighter border-b-8 border-brand-accent pb-2 inline-block italic">世界のAIニュース</h1>
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.4em] text-xs">Global AI Intelligence — Curated & Analyzed by the Frontier 8</p>
                </div>

                <div className="space-y-0">
                    {newsList.map((news) => (
                        <Link key={news.id} href={`/news/${news.id}`} className="block group border-b border-zinc-100 last:border-none">
                            <div className="py-10 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em] bg-brand-accent/5 px-3 py-1 border border-brand-accent/10">{news.source}</span>
                                    <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{news.tag}</span>
                                    <span className="text-[10px] text-zinc-300 font-black uppercase tracking-widest ml-auto">{news.date} · {news.time}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-zinc-800 group-hover:text-zinc-950 transition-colors leading-tight tracking-tight">{news.title}</h2>
                                <p className="text-zinc-500 font-medium leading-relaxed line-clamp-2 text-base">{news.body}</p>
                                <div className="pt-2 flex items-center gap-2 text-[11px] font-black tracking-[0.2em] text-zinc-300 group-hover:text-brand-accent group-hover:translate-x-1 transition-all uppercase">
                                    続きを読む
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <BottomNav />
        </main>
    );
}
