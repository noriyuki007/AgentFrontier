import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";

const startups = [
    {
        id: 1,
        name: "Cognition AI",
        founders: "Scott Wu, Steven Hao, Walden Yan",
        funding: "$175M",
        stage: "Series B",
        desc: "自律型AIソフトウェアエンジニア「Devin」を開発。人間なしでコードを書き、テストし、デプロイできる世界初のAIエンジニアとして、SWE-benchで13.86%の解決率を達成し業界最高水準を更新。",
        focus: "AGI for Software Engineering",
        valuation: "$2B+",
        year: "2023",
        hq: "San Francisco, CA",
        tag: "STRATEGY",
    },
    {
        id: 2,
        name: "DeepScribe",
        founders: "Zafar Chaudry, Matt Ko",
        funding: "$251M",
        stage: "Series C",
        desc: "医療現場における診察音声のリアルタイム文字起こしと、電子カルテへの自動入力を実現。医師の事務負担を最大70%削減し、患者との対話時間を劇的に増加させると報告されている。",
        focus: "Healthcare AI Documentation",
        valuation: "$1B+",
        year: "2019",
        hq: "San Francisco, CA",
        tag: "HEALTH",
    },
    {
        id: 3,
        name: "Figure AI",
        founders: "Brett Adcock",
        funding: "$675M",
        stage: "Series B",
        desc: "BMW工場への実戦投入を果たした汎用人型ロボット「Figure 02」の開発元。OpenAIと協業し、自然言語で指示できる物理知能を実装。製造業の「肉体労働のAGI化」を目指す最注目企業。",
        focus: "Humanoid Robotics",
        valuation: "$2.6B",
        year: "2022",
        hq: "Sunnyvale, CA",
        tag: "ROBOTICS",
    },
    {
        id: 4,
        name: "Anthropic",
        founders: "Dario Amodei, Daniela Amodei",
        funding: "$7.3B",
        stage: "Series E",
        desc: "AI安全性研究を核に据えた「Constitutional AI」の提唱企業。Claude 3.5 Sonnetはコーディング・推論タスクでGPT-4を上回る性能を示し、2026年現在、企業導入数で急速に市場シェアを拡大中。",
        focus: "Safe & Reliable AI Foundation Models",
        valuation: "$61B",
        year: "2021",
        hq: "San Francisco, CA",
        tag: "FOUNDATION",
    },
    {
        id: 5,
        name: "Mistral AI",
        founders: "Arthur Mensch, Guillaume Lample, Timothée Lacroix",
        funding: "$1.08B",
        stage: "Series B",
        desc: "フランス発の欧州最強LLMスタートアップ。「Mistral Large」はGPT-4クラスの性能を持ちつつ、大幅に低い推論コストを実現。オープンソース戦略でエンタープライズ市場への浸透を加速させている。",
        focus: "Open & Efficient LLMs",
        valuation: "$6B",
        year: "2023",
        hq: "Paris, France",
        tag: "OPEN-SOURCE",
    },
    {
        id: 6,
        name: "Cohere",
        founders: "Aidan Gomez, Ivan Zhang, Nick Frosst",
        funding: "$445M",
        stage: "Series D",
        desc: "エンタープライズ向けAI言語モデルに特化したプラットフォーム。RAG（検索拡張生成）とセキュリティを重視した設計で、金融・法務・医療分野での導入が急拡大。On-prem対応で規制業種の信頼を獲得。",
        focus: "Enterprise NLP Platform",
        valuation: "$5.5B",
        year: "2019",
        hq: "Toronto, Canada",
        tag: "ENTERPRISE",
    },
];

export default function StartupIndex() {
    return (
        <main className="min-h-screen pb-24 bg-white">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
                <div className="space-y-3 border-b border-zinc-100 pb-8">
                    <h1 className="text-5xl font-serif font-black tracking-tighter border-b-8 border-blue-600 pb-2 inline-block">AIスタートアップ最前線</h1>
                    <p className="text-zinc-400 font-bold uppercase tracking-[0.4em] text-xs">Tracking the Next Generation of AI Titans — Curated by The Frontier 8</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {startups.map((s) => (
                        <a key={s.id} href={`/startups/${s.id}`} className="group p-8 rounded-none bg-zinc-50 border border-zinc-100 hover:border-brand-accent/40 transition-all hover:shadow-lg block">
                            <div className="space-y-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter group-hover:text-brand-accent transition-colors">{s.name}</h2>
                                        <p className="text-[10px] font-bold text-zinc-400 tracking-widest mt-0.5">{s.hq} · {s.year}年設立</p>
                                    </div>
                                    <span className="px-2 py-1 bg-zinc-900 text-white text-[9px] font-black rounded-none tracking-widest flex-shrink-0">{s.stage}</span>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-black tracking-widest text-zinc-300 uppercase">Core Focus</p>
                                    <p className="font-bold text-zinc-700 text-sm">{s.focus}</p>
                                </div>

                                <p className="text-zinc-500 leading-relaxed font-medium text-sm">{s.desc}</p>

                                <div className="pt-4 flex items-center justify-between border-t border-zinc-100">
                                    <div className="space-y-0.5">
                                        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">調達額</p>
                                        <p className="text-base font-black text-zinc-900">{s.funding}</p>
                                    </div>
                                    <div className="space-y-0.5 text-right">
                                        <p className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">評価額</p>
                                        <p className="text-base font-black text-brand-accent">{s.valuation}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] font-black text-zinc-300 group-hover:text-brand-accent transition-all uppercase">
                                    詳細を読む
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} /></svg>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
            <BottomNav />
        </main>
    );
}
