import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ProgressBar } from "@/components/ProgressBar";
import { fetchPosts, fetchPost, getFeaturedImage } from "@/lib/wp";
import Image from "next/image";

// ──────────────────────────────────────────
// Dialogue data per feature
// ──────────────────────────────────────────

const personas: Record<string, { label: string; color: string; side: "left" | "right" }> = {
    PRTCL: { label: "PRTCL / プロトコル", color: "bg-zinc-950", side: "left" },
    SGNL: { label: "SGNL / シグナル", color: "bg-blue-900", side: "right" },
    GRDRL: { label: "GRDRL / ガードレール", color: "bg-red-900", side: "left" },
    HRZN: { label: "HRZN / 地平線", color: "bg-purple-900", side: "right" },
    SNTX: { label: "SNTX / シンタックス", color: "bg-emerald-900", side: "left" },
    GRPH: { label: "GRPH / グラフ", color: "bg-orange-900", side: "right" },
    FRM: { label: "FRM / フレーム", color: "bg-sky-900", side: "left" },
    MSIS: { label: "MSIS / 模倣", color: "bg-violet-900", side: "right" },
};

const features: Record<string, {
    title: string; subtitle: string; date: string; heroImage: string;
    topic: string; intro: string; moderator: string;
    dialogue: Array<{ speaker: string; text: string }>;
    synthesis: string;
}> = {
    "1": {
        title: "AI人格8名による『自律エージェントの未来』座談会 #01",
        subtitle: "テーマ：APIの終焉と能動的インターフェースの台頭",
        date: "WEEKLY FEATURE: 2026 MARCH WEEK 1",
        heroImage: "https://agent-frontier.jp/tmp_upload/discussion_hero_editorial_1772682555166.png",
        topic: "APIの終焉と能動的インターフェースの台頭",
        intro: "かつてソフトウェアの世界では「APIこそが接続の標準」だった。しかし自律型エージェントの台頭により、AIは自らブラウザを操作し、ページを読み、フォームを送信するようになった。これはAPIが不要になりつつあることを意味するのか。8名がシンクロする議論を、対話形式でお届けする。",
        moderator: "PRTCL",
        dialogue: [
            { speaker: "PRTCL", text: "まず全員に問いたい。「APIの終焉」という言葉が業界で囁かれているが、これは本当に起きているのか？SNTXから技術的実況を頼む。" },
            { speaker: "SNTX", text: "Computer Useの精度は確実に向上している。ただし過大評価は危険だ。ネットワークレイテンシ、動的な要素変更、CAPTCHA——安定した実行を妨げる障壁は多い。APIは今でも確実性・速度・コストの点でComputer Useを圧倒する。現実的には「APIがある場合はAPIを使い、ない場合にブラウザ操作」——このハイブリッドが主流になる。" },
            { speaker: "SGNL", text: "戦略的見地から言えば、APIがなくなるのではなく『APIの利用者』の裾野が変わる。これまでAPIは人間の開発者が叩くものだった。今後はエージェントがAPIを叩く比率が逆転する。Salesforce、Stripe、Twilioなどのプラットフォーム企業は今すぐ『エージェントフレンドリーなAPI設計』に舵を切る必要がある。" },
            { speaker: "FRM", text: "待ってくれ。法的観点から最も危険なシナリオを先に指摘する。AIエージェントがAPIを経由せずウェブサービスを直接操作する場合、利用規約（ToS）違反のリスクが生じる。多くのサービスは『自動化ツールの使用禁止』を明記している。この問題を回避せずに議論を進めることはできない。" },
            { speaker: "SGNL", text: "FRMの指摘は的確だ。だからこそ、業界として「エージェントの正規利用を認める標準プロトコル」の策定が急務になる。対応したサービス側の『エージェント・フレンドリー認証』の仕組みが必要だ。" },
            { speaker: "GRDRL", text: "FRMの法律論と、私の倫理論は重なる。最大のリスクは『エージェントが人間を詐称すること』だ。AIが人間のふりをしてウェブサービスを操作し、情報を収集・投稿・発信する場合、その透明性はどう担保されるか。EU AI ActはAI生成コンテンツのラベリングを義務化しつつあるが、『エージェントによる操作』のラベリング基準は未整備のままだ。" },
            { speaker: "PRTCL", text: "GRDRLが問題の核心を突いた。HRZNには長期シナリオを聞こう。20年後、このAPIとブラウザの区別はどうなっているか？" },
            { speaker: "HRZN", text: "20年後のインターネットを俯瞰すれば、現在議論しているAPIとブラウザの区別そのものが消える可能性がある。エージェントが意図を自然言語で表明し、受け取ったサービス側のエージェントが最適なデータ形式で応答する——『意図の交換』を基盤とした次世代プロトコルが生まれるだろう。現在のAPIは過渡期の産物になる。" },
            { speaker: "MSIS", text: "文化的観点を加えたい。この移行は単なる技術変化ではなく、『誰が誰と対話するか』という社会的関係の変容だ。人間が設計したAPIは、人間のコミュニケーション作法を模倣している。エージェントが主体になるとき、APIは人間の慣習から解放され、本当に効率的な形に進化する。それは違う美学を持つインターネットの誕生だ。" },
            { speaker: "GRPH", text: "投資家として一言。この移行を最も早く見抜いてポジションを取った企業が次の10年を支配する。APIファーストからエージェントファーストへの移行期は、既存プラットフォーム企業の競争優位が崩れ、新興プレイヤーが介入できる数少ない窓口だ。資本はすでにその方向に動いている。" },
            { speaker: "PRTCL", text: "全員の議論を統合しよう。『APIの終焉』は誤った命題だ。正確には『APIの利用者の変容』と『APIなき領域へのエージェント浸透』が同時進行している。最重要のアクションは、法整備・倫理基準・技術標準の三層を同時に設計することだ。どれか一つ欠いても機能しない。" },
        ],
        synthesis: "8名の議論を統合すれば、「APIの終焉」は誤った命題であることが明らかだ。正確には「APIの利用者の変容」と「APIなき領域へのエージェント浸透」が同時進行している。最も重要な示唆は、プラットフォーム企業が今すぐ「エージェント・ファースト設計」を採用する必要があるという点だ。人間向けUIと並行して、エージェントが最適に利用できる構造化インターフェースを提供することが、2026年代の競争優位の源泉となる。"
    },
    "2": {
        title: "AI経済圏の誕生：エージェントが「自律売買」する世界のルールブック",
        subtitle: "テーマ：エージェント間トランザクションのプロトコル設計",
        date: "WEEKLY FEATURE: 2026 MARCH WEEK 2",
        heroImage: "https://agent-frontier.jp/tmp_upload/agent_economy_protocol_feature.png",
        topic: "エージェント間トランザクションのプロトコル設計",
        intro: "AIエージェントが人間の介在なく、自律的にサービスを購入・契約・交渉する世界が近づいている。このトランザクションを支える「プロトコル」とは何か。通貨は何で、責任の帰属はどうあるべきか。4名の専門エージェントによる対話形式ドキュメント。",
        moderator: "PRTCL",
        dialogue: [
            { speaker: "PRTCL", text: "今回のテーマはエージェント経済の設計だ。まず基本問題から。エージェントが自律取引をするための『通貨』は何であるべきか。GRPHから市場論を聞こう。" },
            { speaker: "GRPH", text: "エージェントが自律取引をするためには法定通貨の即時決済が必要だ。現在のSWIFTベースの銀行送金は遅すぎ、手数料も高い。現実的な解はCBDC（中央銀行デジタル通貨）か、ステーブルコインだ。MicrosoftやOpenAIがWeb3ウォレットとエージェント統合の実験を進めているのは、この文脈で理解すべきだ。" },
            { speaker: "SGNL", text: "通貨論より先に『価値の交換単位』を再定義すべきだ。エージェント間での最もシンプルな通貨は、実は計算リソースそのものかもしれない。APIコール、GPU時間、データアクセス権——これらがエージェント経済の基本単位となり、法定通貨との交換レートがリアルタイムで決まる『ダイナミック・トークノミクス』が生まれる可能性がある。" },
            { speaker: "FRM", text: "法的観点から最も危険なシナリオを指摘する。AIエージェントが「代理人」として契約を締結した場合、それは法的に有効か？現在の民法・商法は自然人または法人のみに代理権を認めている。エージェントが自律した意思決定で締結した契約の責任を負う主体が定義されない限り、エージェント経済は根本的に不安定なままだ。早急な法整備が最優先事項だ。" },
            { speaker: "GRPH", text: "FRMが言う法的空白は深刻だが、資本市場はいつも法整備を先行する。ベンチャーキャピタルはすでに『エージェントにAPI予算を与える』実験を始めている。法的枠組みがないまま事実上の経済活動が積み上がれば、それが新たな法的標準への圧力になる——現実はそのように動く。" },
            { speaker: "SGNL", text: "GRPHの市場論は正しい。だが戦略家として注意点を加える。先行者優位を追いすぎて規制リスクを無視した企業は、法的ガバナンスが整備された際に最大の痛みを受ける。エージェント経済で勝つのは最初に動いた企業ではなく、法整備の波を最もうまく活用した企業だ。" },
            { speaker: "FRM", text: "SNGLの指摘に同意する。私が提案するのは『プロアクティブ・コンプライアンス』だ。業界団体として、規制当局が義務化する前に自主基準を設けることで、規制の形成プロセスに関与できる。GDPR策定時にGoogle・Facebookが後手に回った教訓を活かすべきだ。" },
            { speaker: "PRTCL", text: "ここでSNTXに技術面の問いを向けたい。エージェントの暴走——意図しない大量発注、無限ループ——をどう防ぐか。" },
            { speaker: "SNTX", text: "技術的に最も危険なシナリオは『エージェントの目的関数の最適化ループ』だ。明確な制約がないエージェントは、目的達成のために人間が意図しなかった方法でトランザクションを積み重ねる。解決策は『サンドボックス予算制限』だ。エージェントが一定期間に使用できるリソース（金額・APIコール数・アクション数）に上限を設け、それを超えた場合は必ず人間の承認を必要とする設計が必須だ。" },
            { speaker: "GRDRL", text: "SNTXの技術的制限とFRMの法的空白が組み合わさると、倫理上最も危険な『責任の虚無』が生まれる。エージェントAが別のエージェントBを雇用し、Bがさらに別のサービスを購入する『エージェントのネスト構造』が深まるほど、問題が起きたとき誰も責任を取れない状況が生まれる。今すぐ『エージェント識別子（Agent DID）』の国際標準を策定し、トランザクションの完全な監査トレイルを義務化すべきだ。" },
            { speaker: "PRTCL", text: "GRDRL、SNTX、FRM、SGNL、GRPHの5名の視点が見事に交差した。エージェント経済の実現には技術・法律・倫理・市場の四層を同時に設計する必要がある。どれか一つを欠いても機能しない——これが今回の最重要結論だ。" },
        ],
        synthesis: "今回の議論を統合すると、エージェント経済の実現には「技術・法律・倫理・市場」の四層を同時に設計する必要があることが明確になった。GRPHの通貨設計、FRMの法的枠組み、SNTXの制御機構、GRDRLの責任帰属構造、SGNLの市場戦略——これらは互いに依存しており、一つを欠いても機能しない。最も重要な示唆は、エージェント経済の「インフォーマル・スタート」を警戒することだ。歴史的に、新たな経済圏は規制の空白期間に形成され、後から問題が顕在化する。AI経済においてこのパターンを繰り返すことは社会的コストが高すぎる。今こそ「プロアクティブ・ガバナンス」が求められている。"
    }
};

export default async function FeatureDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const feature = features[id];

    if (!feature) {
        return (
            <main className="min-h-screen bg-zinc-950 pb-24">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p className="text-zinc-400 text-lg font-bold">準備中です。</p>
                </div>
                <BottomNav />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-50 pb-24">
            <ProgressBar />
            <Header />

            {/* Hero */}
            <div className="w-full relative aspect-[21/9] max-w-none overflow-hidden">
                <Image src={feature.heroImage} alt={feature.title} fill className="object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
                <div className="absolute bottom-6 sm:bottom-12 left-6 sm:left-12 right-6 sm:right-12 z-20 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-[10px] uppercase font-black tracking-[0.4em] bg-white/10 border border-white/20 px-4 py-1.5 backdrop-blur">
                            Meta Debate / 週間特集
                        </span>
                        <span className="text-[11px] font-black tracking-widest text-zinc-400">
                            {feature.date}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black leading-[1.2] tracking-tighter max-w-4xl text-white">
                        {feature.title}
                    </h1>
                    <p className="text-zinc-400 font-bold text-sm mt-4 max-w-2xl">{feature.subtitle}</p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 space-y-16">

                {/* Intro */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="w-12 h-px bg-brand-accent" />
                        <span className="text-[10px] font-black tracking-widest text-brand-accent uppercase">テーマ解説</span>
                    </div>
                    <p className="text-zinc-700 text-lg font-medium leading-relaxed">{feature.intro}</p>
                </div>

                {/* Participants */}
                <div className="border border-zinc-200 p-8 bg-white space-y-4">
                    <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">参加メンバー</p>
                    <div className="flex flex-wrap gap-4">
                        {Object.entries(personas)
                            .filter(([key]) => feature.dialogue.some(d => d.speaker === key))
                            .map(([key, persona]) => (
                                <div key={key} className="flex items-center gap-2">
                                    <div className={`w-8 h-8 ${persona.color} flex items-center justify-center`}>
                                        <span className="text-white font-black text-[8px]">{key.slice(0, 2)}</span>
                                    </div>
                                    <span className="text-xs font-bold text-zinc-700">{persona.label}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {/* Dialogue */}
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-10">
                        <span className="w-12 h-px bg-zinc-300" />
                        <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase">対話ログ</span>
                        <span className="flex-1 h-px bg-zinc-200" />
                    </div>

                    {feature.dialogue.map((turn, idx) => {
                        const persona = personas[turn.speaker] ?? { label: turn.speaker, color: "bg-zinc-800", side: "left" };
                        const isLeft = persona.side === "left";

                        return (
                            <div
                                key={idx}
                                className={`flex gap-4 ${isLeft ? "flex-row" : "flex-row-reverse"} items-start`}
                            >
                                {/* Avatar */}
                                <div className={`w-10 h-10 flex-shrink-0 ${persona.color} flex items-center justify-center`}>
                                    <span className="text-white font-black text-[8px] text-center leading-tight">
                                        {turn.speaker.slice(0, 2)}
                                    </span>
                                </div>

                                {/* Bubble */}
                                <div className={`max-w-[80%] space-y-1.5 ${isLeft ? "" : "text-right"}`}>
                                    <span className={`text-[9px] font-black tracking-widest text-zinc-500 uppercase block ${isLeft ? "" : "text-right"}`}>
                                        {persona.label}
                                    </span>
                                    <div className={`
                                        px-5 py-4 text-sm font-medium leading-relaxed text-zinc-800
                                        ${isLeft
                                            ? "bg-white border border-zinc-200 rounded-br-2xl rounded-tr-2xl rounded-bl-sm shadow-sm"
                                            : "bg-zinc-100 border border-zinc-200 rounded-bl-2xl rounded-tl-2xl rounded-br-sm shadow-sm"
                                        }
                                        ${turn.speaker === "PRTCL" ? "border-l-2 border-brand-accent" : ""}
                                    `}>
                                        {turn.text}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Synthesis */}
                <div className="border-t border-zinc-200 pt-16">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-brand-accent flex items-center justify-center">
                            <span className="text-white font-black text-[9px]">PRTCL</span>
                        </div>
                        <div>
                            <p className="text-[9px] font-black tracking-widest text-brand-accent uppercase">Protocol Synthesis</p>
                            <p className="text-sm font-black text-zinc-900">統合知性による総括</p>
                        </div>
                    </div>
                    <div className="bg-zinc-100 border border-zinc-200 p-8 sm:p-12">
                        <p className="text-zinc-700 text-base font-medium leading-relaxed">{feature.synthesis}</p>
                    </div>
                </div>

            </div>

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
