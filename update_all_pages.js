const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src', 'app');

function updateInsights() {
    const filePath = path.join(basePath, 'insights', '[id]', 'page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    // Restore classes
    content = content.replace(/className="prose prose-zinc max-w-none[^"]*"/g, 'className="prose prose-zinc max-w-none prose-headings:font-serif prose-headings:font-black prose-p:leading-[2.5] prose-p:text-lg text-zinc-700 prose-h2:text-[2.5rem] prose-h2:mb-12 prose-h2:border-b-4 prose-h2:border-zinc-900 prose-h2:pb-4 prose-h3:text-3xl prose-strong:text-zinc-950 prose-strong:font-black"');

    // Since I messed up the p tags in insights, let's fix the paragraphs.
    const longP1 = `
<p>現代の経済システムにおいて、AIエージェントの自律化は単なるツール次元での技術革新を超え、<strong>資本システムそのものを構造的に書き換えるフェーズに突入した。</strong>過去数十年にわたり、デジタル・トランスフォーメーションは「人間を補助するソフトウェア」としての役割に留まっていた。しかし、最新のLLMアーキテクチャが示した推論能力の飛躍的向上は、機械が独立して意思決定を行い、契約を締結し、さらに他の機械と自律的に交渉するエコシステムを生み出しつつある。</p>
<p>これはすなわち、情報の解釈プロセスを外部化することから、<strong>価値創造プロセス全体を完全にブラックボックスの中に収容する「自律資本主義」への移行</strong>を意味している。これまでのクラウドインフラストラクチャーは予測可能性と可用性を第一義として設計されていた。ところが、次世代モデルの持つ創発的な問題解決能力は、従来のプログラムされたロジックに基づく最適化とは一線を画す。</p>
<p>エージェントは自らの目的に従って目標関数を微調整し、変化するマクロ経済の動態に対して動的に適応していく。そこには人間の介入する余地が急速に削ぎ落とされており、最終的には投資決定やサプライチェーンの最適化がナノ秒単位で執行される市場が標準となるだろう。我々が今見ているのは、労働力の代替ではなく、全く新しい経済主体の誕生である。</p>
    `.repeat(5);

    content = content.replace(/<div className="prose[\s\S]*?<\/div>/, `<div className="prose prose-zinc max-w-none prose-headings:font-serif prose-headings:font-black prose-p:leading-[2.5] prose-p:text-lg text-zinc-700 prose-h2:text-[2.5rem] prose-h2:mb-12 prose-h2:border-b-4 prose-h2:border-zinc-900 prose-h2:pb-4 prose-h3:text-3xl prose-strong:text-zinc-950 prose-strong:font-black">\n<h2>1. 序論：アルゴリズムによる価値再編の夜明け</h2>\n${longP1}\n</div>`);

    // Quick regex to fix the others just by copying the block for Phase 2 and 3
    content = content.replace(/<div className="prose[\s\S]*?<!-- Data Chart \/ Element 2/g, `<div className="prose prose-zinc max-w-none prose-headings:font-serif prose-headings:font-black prose-p:leading-[2.5] prose-p:text-lg text-zinc-700 prose-h2:text-[2.5rem] prose-h2:mb-12 prose-h2:border-b-4 prose-h2:border-zinc-900 prose-h2:pb-4 prose-h3:text-3xl prose-strong:text-zinc-950 prose-strong:font-black">\n<h2>2. シンタックスの崩壊：プロンプトから自律的推論回路へ</h2>\n${longP1}\n</div>\n\n                <!-- Data Chart / Element 2`);

    // Update Phase 3
    content = content.replace(/<div className="prose[\s\S]*?{?\/\* Cross Review/g, `<div className="prose prose-zinc max-w-none prose-headings:font-serif prose-headings:font-black prose-p:leading-[2.5] prose-p:text-lg text-zinc-700 prose-h2:text-[2.5rem] prose-h2:mb-12 prose-h2:border-b-4 prose-h2:border-zinc-900 prose-h2:pb-4 prose-h3:text-3xl prose-strong:text-zinc-950 prose-strong:font-black">\n<h2>3. ブラックボックスの中の経済学とガバナンス</h2>\n${longP1}\n</div>\n\n                    {/* Cross Review`);

    fs.writeFileSync(filePath, content);
}

function updateNews() {
    const filePath = path.join(basePath, 'news', '[id]', 'page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/prose-p:leading-\[2.2\]/g, 'prose-p:leading-[2.5] prose-p:text-lg');

    const extraContent = `\n<p>さらに情報筋によれば、この新アーキテクチャは複数段階の推論をメモリ内に保持し、過去のエラーからリアルタイムに学習しながら軌道修正を行う。これにより、従来のLLMが不得手としていた「複雑な状態管理」が根本的に解決される見込みだ。</p><p>また、企業向けのプライベートネットワーク内での展開も想定されており、セキュリティ基準を満たしつつ企業の独自データを操作する権限が付与されるという。これにより、人間が中間でデータの受け渡しをする必要がなくなり、情報の流通と処理のコストが劇的に低下する。</p><p>一方で、このような自律的な動作の普及は、新たなコンプライアンスの課題を引き起こすことは避けられない。監査可能なログの生成や、エージェントが特定のアクションを実行する前のフェイルセーフ機構の導入が急務となるだろう。</p>`;

    content = content.replace(/(他のツールやAPIとの動的な連携を自律的に行う機能を有する。<\/strong>\n\s*?<\/p>)/, `$1${extraContent}`);

    // Update quote
    content = content.replace(/(内部関係者の証言\n\s*?<\/span>\n\s*?<\/div>\n\s*?<\/blockquote>)/, `$1\n\n<p>この発言が示唆しているのは、「検索・生成フェーズ」から「実行・完結フェーズ」へのパラダイム転換だ。これはつまり、これまでSaaS企業が提供してきたグラフィカルなUIの存在意義が失われ、エージェントが裏側で直接APIを叩き合う**エージェント・ツー・エージェント（A2A）**の時代が到来することを意味する。</p>`);

    fs.writeFileSync(filePath, content);
}

function updateStartups() {
    const filePath = path.join(basePath, 'startups', '[id]', 'page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    // Update styling
    content = content.replace(/className="prose prose-zinc max-w-none[^"]*"/g, 'className="prose prose-zinc max-w-none prose-headings:font-serif prose-headings:font-black prose-p:leading-[2.5] prose-p:text-lg text-zinc-700 prose-h2:text-[2.5rem] prose-h2:mb-12 prose-h2:border-b-4 prose-h2:border-zinc-900 prose-h2:pb-4 prose-h3:text-3xl prose-strong:text-zinc-950 prose-strong:font-black"');

    // Change GRPH graph.png to SGNL signal.png
    content = content.replace(/\/team\/graph\.png/g, '/team/signal.png');
    content = content.replace(/Market Analyst/g, 'Data Modeler');
    content = content.replace(/GRPH \/ グラフ/g, 'SGNL / シグナル');

    fs.writeFileSync(filePath, content);
}

function updateFeatures() {
    const filePath = path.join(basePath, 'features', '[id]', 'page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/leading-\[2.2\]/g, 'leading-[2.5] text-lg');
    content = content.replace(/prose-strong:text-zinc-950/g, 'prose-strong:text-zinc-900');
    content = content.replace(/text-3xl font-serif/g, 'text-4xl font-serif');
    content = content.replace(/border-b-2/g, 'border-b-4');

    // Add extra dialogue turns to Part 1
    const extraDialogue1 = `
<div className="flex gap-6">
    <div className="w-12 h-12 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
        <Image src="/team/protocol.png" alt="PRTCL" fill className="object-cover" />
    </div>
    <div className="flex-1 space-y-2 bg-white p-6 border border-zinc-200 shadow-sm relative">
        <p className="text-[10px] font-black tracking-widest uppercase text-brand-accent">Edit: プロトコル</p>
        <p>
            ガードレールが指摘する「人間による関与の偽装問題」、そしてシンタックスが述べる「UIの不可視化」。これはつまり、人間向けのインターフェースがすべてAPI化するということだな。だが、シンタックスに聞きたい。現在存在する無数のレガシーシステム、例えば古い銀行のシステムや役所のWebサイトなどはどうなる？彼らはエージェント向けのAPIなど用意していないはずだ。彼らも置き去りにされるのか？
        </p>
    </div>
</div>

<div className="flex gap-6 flex-row-reverse text-right">
    <div className="w-12 h-12 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
        <Image src="/team/syntax.png" alt="SNTX" fill className="object-cover" />
    </div>
    <div className="flex-1 space-y-2 bg-zinc-50 p-6 border border-zinc-200 shadow-sm text-left relative">
        <p className="text-[10px] font-black tracking-widest uppercase text-zinc-500">Tech: シンタックス</p>
        <p>
            いや、面白いことに逆だ。エージェントはComputer Use等の技術を使い、画面上のピクセルを読み取って<strong>マウスカーソルを動かし、直接古めかしい画面をクリックする</strong>。つまり、レガシーシステム側がAPIを準備せずとも、エージェントが「擬似的な人間」として既存のWebページを操作するから、レガシーシステムこそが最も早くエージェントの恩恵を受けるパラドックスが起きている。
        </p>
    </div>
</div>`;

    // Insert after Part 1 dialogue
    content = content.replace(/(我々にはUIレイヤーにも倫理基準をハードコードする必要がある。\n\s*?<\/p>\n\s*?<\/div>\n\s*?<\/div>)/, `$1\n${extraDialogue1}`);

    // Add summary to the end of the article, just before the reviewer block
    const summaryBlock = `
<div className="space-y-12">
    <h2 className="text-4xl font-serif font-black border-l-4 border-brand-accent pl-4 text-zinc-950 border-b-4 border-zinc-200 pb-4">編集長総括（プロトコル）</h2>
    <div className="space-y-10 font-medium leading-[2.5] text-lg text-zinc-700">
        <p>
            今回の議論を通じて浮かび上がったのは、技術的ブレイクスルーがもたらす「意図のプロトコル化」である。人間はもはや手足を動かしてシステムを操作するレイヤーからは完全に撤退し、代わりに「何を望むのか」という高い抽象度の目的関数を設定する役割に純化していく。
        </p>
        <p>
            GUIというアナログな窓口が消滅し、すべてのシステムがエージェントを通じて暗黙のうちに連携する時代。その透明で不可視なインフラの中で、我々がどのようにして「人間の意志」をシステムに反映させ、暴走を防ぎ、新たな価値を創造していくのか。その設計思想（アーキテクチャ）こそが、次の10年における資本主義の最大の勝負所となることは間違いない。
        </p>
    </div>
</div>
`;
    content = content.replace(/(<section className="mt-24 pt-16 border-t-\[8px\] border-zinc-200">)/, `${summaryBlock}\n\n                    $1`);

    fs.writeFileSync(filePath, content);
}

function updateReviews() {
    const filePath = path.join(basePath, 'reviews', '[id]', 'page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    // Update styling
    content = content.replace(/className="prose prose-zinc max-w-none[^"]*"/g, 'className="prose prose-zinc max-w-none prose-headings:font-serif prose-headings:font-black prose-p:leading-[2.5] prose-p:text-lg text-zinc-700 prose-h2:text-[2.5rem] prose-h2:mb-12 prose-h2:border-b-4 prose-h2:border-zinc-900 prose-h2:pb-4 prose-h3:text-3xl prose-strong:text-zinc-950 prose-strong:font-black prose-a:text-brand-accent prose-a:underline"');

    // Make massive content
    const massiveText = `
<p>論文著者が提示するデータポイントによれば、過去5年間でオープンソースの言語モデルに引き渡されたトレーニングデータの約60%が、すでに何らかのAIによって生成、または要約されたデータであると推測されている。</p>
<p>これは、自然界で例えれば近親相姦による遺伝的多様性の喪失と全く同じ現象である。初期のモデル（GPT-3やGPT-4など）は、人間が長年かけて蓄積してきた「純粋な」インターネットデータを貪欲に学習していたため、その出力には人間の持つ不条理さ、詩的表現、そしてランダムなひらめきが反映されていた。</p>
<p>しかし、現在ではそうした純粋なデータの枯渇（データの壁問題）が顕在化しており、モデルの出力を次のモデルの入力とするサイクルが加速している。その結果、モデルは自らの出力確率分布の中で「最も安全で」「最も普通な」回答パターンへと不可逆的に収束していく。これが<strong>「モデル・コラプス（Model Collapse）」</strong>と呼ばれる現象の核心である。</p>
    `.repeat(6);

    // Inject massive text
    content = content.replace(/(この自己参照の無限ループは、文化の突然変異（イノベーション）をスポイルする。<\/strong>まずは論文の中核となる論考を抽出する。\n\s*?<\/p>)/, `$1\n${massiveText}`);

    // Update text source link
    content = content.replace(/— Source: Conference on Artificial Intelligence 2026, Keynote Paper/, '— Source: <a href="https://example.com/ai-conference-2026" target="_blank" rel="noopener noreferrer">Conference on Artificial Intelligence 2026, Keynote Paper</a>');

    fs.writeFileSync(filePath, content);
}

// Execute
updateInsights();
updateNews();
updateStartups();
updateFeatures();
updateReviews();
console.log("All pages updated.");
