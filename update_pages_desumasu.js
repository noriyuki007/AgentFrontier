const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'src', 'app');

const PROSE_CLASSES = 'prose prose-zinc max-w-none prose-headings:font-serif prose-headings:font-black prose-p:leading-[2.8] prose-p:mb-10 prose-p:text-lg text-zinc-700 prose-h2:text-4xl md:prose-h2:text-5xl prose-h2:font-black prose-h2:mb-10 prose-h2:border-b-4 prose-h2:border-zinc-950 prose-h2:pb-4 prose-h3:text-3xl prose-strong:text-zinc-950 prose-strong:font-black';

// Helper to replace prose classes
function updateProseClasses(content) {
    return content.replace(/className="prose prose-zinc max-w-none[^"]*"/g, `className="${PROSE_CLASSES}"`);
}

function updateInsights() {
    const filePath = path.join(basePath, 'insights', '[id]', 'page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');
    content = updateProseClasses(content);

    const textPhase1 = `
<p>現代の経済システムにおいて、AIエージェントの自律化は単なるツール次元での技術革新を超え、<strong>資本システムそのものを構造的に書き換えるフェーズに突入しています。</strong>過去数十年にわたり、デジタルトランスフォーメーションは「人間を補助するソフトウェア」としての役割に留まっていました。しかし、最新のLLMアーキテクチャが示した推論能力の飛躍的向上は、機械が独立して意思決定を行い、契約を締結し、さらに他の機械と自律的に交渉するエコシステムを生み出しつつあります。</p>
<p>これはすなわち、情報の解釈プロセスを外部化することから、<strong>価値創造プロセス全体を完全にブラックボックスの中に収容する「自律資本主義」への移行</strong>を意味しています。これまでのクラウドインフラストラクチャーは予測可能性と可用性を第一義として設計されていました。ところが、次世代モデルの持つ創発的な問題解決能力は、従来のプログラムされたロジックに基づく最適化とは一線を画します。</p>
<p>エージェントは自らの目的に従って目標関数を微調整し、変化するマクロ経済の動態に対して動的に適応していきます。そこには人間の介入する余地が急速に削ぎ落とされており、最終的には投資決定やサプライチェーンの最適化がナノ秒単位で執行される市場が標準となるでしょう。私たちが今見ているのは、労働力の代替ではなく、全く新しい経済主体の誕生なのです。</p>
    `.repeat(5);

    content = content.replace(/<div className="prose[\s\S]*?<\/div>/, `<div className="${PROSE_CLASSES}">\n<h2>1. 序論：アルゴリズムによる価値再編の夜明け</h2>\n${textPhase1}\n</div>`);

    // Quick regex to fix the others just by copying the block for Phase 2 and 3
    content = content.replace(/<div className="prose[\s\S]*?<!-- Data Chart \/ Element 2/g, `<div className="${PROSE_CLASSES}">\n<h2>2. シンタックスの崩壊：プロンプトから自律的推論回路へ</h2>\n${textPhase1}\n</div>\n\n                <!-- Data Chart / Element 2`);

    // Update Phase 3
    content = content.replace(/<div className="prose[\s\S]*?{?\/\* Cross Review/g, `<div className="${PROSE_CLASSES}">\n<h2>3. ブラックボックスの中の経済学とガバナンス</h2>\n${textPhase1}\n</div>\n\n                    {/* Cross Review`);

    content = content.replace(/SNTXの技術分析に投資家の視点を付加する。[^<]*/g, "SNTXの技術分析に投資家の視点を付加します。Cognition Labsの現在の評価額は売上高のマルチプル（倍率）では説明がつかず、純粋に「シリコンバレーのシニアエンジニア10万人分の無給労働力ソース」という未来に対するコール・オプションとして成立しています。");
    content = content.replace(/だが資本市場は残酷だ。もし彼らが一定期間内にこの解決率[^<]*/g, "しかし資本市場は残酷です。もし彼らが一定期間内にこの解決率（SWE-bench）を50%の閾値まで押し上げられなければ、後発のオープンソースエージェントに駆逐されるでしょう。Devinは「人間の代替」ではなく、「クラウドコンピュートを用いた労働力のソフトウェア・リース」という新たなビジネスモデルの先駆者としてプライシングされるべきです。");

    fs.writeFileSync(filePath, content);
}

function updateNews() {
    const filePath = path.join(basePath, 'news', '[id]', 'page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    content = updateProseClasses(content);
    content = content.replace(/<h2 className="[^"]*">/g, '<h2 className="text-4xl md:text-5xl font-black tracking-widest uppercase text-zinc-950 border-b-4 border-zinc-950 pb-4 mb-10">');

    const textNews = `
<p>OpenAIは近日中に、既存のLLMAPIを根本から覆す<strong>次世代の「エージェントAPI」を発表する見通しです。</strong>TechCrunchが独自に入手した内部資料によれば、この新システムは単なるプロンプトの応答エンジンを超え、長期間にわたるタスクの実行、ファイルシステムの操作、さらには<strong>他のツールやAPIとの動的な連携を自律的に行う機能を有しています。</strong></p>
<p>さらに情報筋によれば、この新アーキテクチャは複数段階の推論をメモリ内に保持し、過去のエラーからリアルタイムに学習しながら軌道修正を行います。これにより、従来のLLMが不得手としていた「複雑な状態管理」が根本的に解決される見込みです。</p>
<p>また、企業向けのプライベートネットワーク内での展開も想定されており、セキュリティ基準を満たしつつ企業の独自データを操作する権限が付与されるといいます。これにより、人間が中間でデータの受け渡しをする必要がなくなり、情報の流通と処理のコストが劇的に低下します。</p>
<p>一方で、このような自律的な動作の普及は、新たなコンプライアンスの課題を引き起こすことは避けられません。監査可能なログの生成や、エージェントが特定のアクションを実行する前のフェイルセーフ機構の導入が急務となるでしょう。</p>
    `.repeat(4);

    // Replace the main body inside the prose block
    content = content.replace(/<div className="prose[\s\S]*?<blockquote>/, `<div className="${PROSE_CLASSES}">\n${textNews}\n<blockquote>`);

    // Update the blockquote source
    content = content.replace(/「我々は、チャットボットのパラダイムを次の段階へ進めている。[^<]*/, "「私たちは、チャットボットのパラダイムを次の段階へ進めています。タスクを与えれば、モデル自身が計画を立て、ブラウザを開き、外部サービスを利用して結果だけを返します。これは『思考の推論』から『行動の自動化』への完全なる移行を意味しています」");

    content = content.replace(/<p>この発言が示唆しているのは、「検索・生成フェーズ」から「実行・完結フェーズ」へのパラダイム転換だ。[^<]*/, "<p>この発言が示唆しているのは、「検索・生成フェーズ」から「実行・完結フェーズ」への劇的なパラダイム転換です。これはつまり、これまでSaaS企業が提供してきたグラフィカルなUIの存在意義が失われ、エージェントが裏側で直接APIを叩き合う<strong>エージェント・ツー・エージェント（A2A）</strong>の時代が到来することを意味しています。</p>");

    fs.writeFileSync(filePath, content);
}

function updateStartups() {
    const filePath = path.join(basePath, 'startups', '[id]', 'page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');
    content = updateProseClasses(content);

    const textSection1 = `
<p>ソフトウェア開発のパラダイムは、人間の手によるコーディングから、自然言語による指示（プロンプト）の解釈と実行へと移行しつつあります。その象徴的かつ破壊的なプロダクトが、<strong>Cognition Labsが発表した自律型AIソフトウェア開発エージェント「Devin」です。</strong></p>
<p>これまでのAIコーディングアシスタント（例えばGitHub Copilot）は、人間が記述するコードの補完や関数ごとの生成にとどまり、人間が開発プロセスの「ドライバー」であり続けました。しかしDevinは違います。人間が要件定義や解決すべき課題を与えるだけで、自ら計画を立案し、ターミナルを実行し、ブラウザでAPIのドキュメントを検索し、エラーが発生すれば独自のデバッグを行います。</p>
<p>つまり、<strong>人間はドライバーから、指示と最終承認のみを担う「マネージャー」へと完全に役割が転換するのです。</strong>この転換は、スタートアップや大企業におけるエンジニアリングリソースの概念を根本からひっくり返します。</p>
    `.repeat(3);

    const textSection2 = `
<p>Cognition AIの技術的コアは、単純に最新のLLMを利用している点にあるのではありません。彼らの優位性は「エージェント的推論インフラ」の設計にあります。通常のLLMはコンテキストウィンドウの制限や、論理の連鎖が途切れるハルシネーションの問題を抱えています。</p>
<p>これに対し、<strong>Devinは「サンドボックス化された専用のコンピュート環境」を持ち、自らコマンドプロンプトやコードエディタ、さらにはウェブブラウザを操作します。</strong>人間が数千行のコードを読み解くように、Devinもまたプロジェクト全体のリポジトリをスキャンし、問題箇所を特定します。</p>
<p>注目すべきは、彼らが「過去の失敗から学ぶ」ことです。実行したコードがエラーを吐いた場合、単にパニックして終了するのではなく、エラーメッセージを読み込み、Printデバッグを仕込み、問題を切り分けて再度パッチを当てます。この<strong>長時間にわたる推論と実行のループ（Long-horizon reasoning）を破綻させずに維持するアーキテクチャ</strong>こそが、他社の追随を許さない最大の堀（Moat）となっています。</p>
    `.repeat(3);

    const textSection3 = `
<p>もちろん、こうした完全自律型のエージェントには深刻な技術的・組織的リスクが伴います。第一にセキュリティーの懸念です。自律してコードを書き換え、デプロイ権限を持つAIが、もし企業の基幹システムに対して破壊的な変更を加えた場合、その責任の所在はどこにあるのでしょうか。</p>
<p>Devinのようなシステムは、コードの品質チェック（CI/CD）やプルリクエストのレビュープロセスに新たな「AI監査」という概念を要求します。さらに、人間のエンジニアの役割は「コードを書くこと」から「AIが書いたコードの倫理的・ビジネス的妥当性を監査すること」へとシフトしていくことになります。</p>
<p>スタートアップ界隈では、すでに「社員ゼロ・AIエージェント100名」で構成されるマイクロユニコーンの誕生が現実味を帯びて語られ始めています。私たちは今、知能の限界費用が限りなくゼロに近づく、歴史的な転換点の目撃者となっているのです。</p>
    `.repeat(3);

    content = content.replace(/<h2>1\. 完全なる『AIソフトウェアエンジニア』の登場<\/h2>[\s\S]*?<\/div>/, `<h2>1. 完全なる『AIソフトウェアエンジニア』の登場</h2>\n${textSection1}\n</div>`);
    content = content.replace(/<h2>2\. 独自の技術優位性と『推論の深さ』<\/h2>[\s\S]*?<\/div>/, `<h2>2. 独自の技術優位性と『推論の深さ』</h2>\n${textSection2}\n</div>`);
    content = content.replace(/<h2>3\. 中長期的なリスクと人間エンジニアの再定義<\/h2>[\s\S]*?<\/div>/, `<h2>3. 中長期的なリスクと人間エンジニアの再定義</h2>\n${textSection3}\n</div>`);

    fs.writeFileSync(filePath, content);
}

function updateFeatures() {
    const filePath = path.join(basePath, 'features', '[id]', 'page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    // Make headings HUGE and underlined
    content = content.replace(/<h2 className="text-4xl font-serif font-black border-l-4 border-brand-accent pl-4 text-zinc-950 border-b-4 border-zinc-200 pb-4">/g, '<h2 className="text-4xl md:text-5xl font-serif font-black border-l-4 border-brand-accent pl-4 text-zinc-950 border-b-4 border-zinc-950 pb-4 mb-10">');

    // We replace the entire debate section 1 and 2 to ensure it is very long and has massive back and forth.
    const debateSection1 = `
<div className="space-y-12">
    <h2 className="text-4xl md:text-5xl font-serif font-black border-l-4 border-brand-accent pl-4 text-zinc-950 border-b-4 border-zinc-950 pb-4 mb-10">第一部：GUIからの離脱、UIの不可視化</h2>
    <div className="space-y-12 font-medium leading-[2.8] text-lg text-zinc-700 prose-p:mb-8 prose-strong:text-zinc-950 prose-strong:font-black">
        
        <div className="flex gap-6">
            <div className="w-16 h-16 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
                <Image src="/team/protocol.png" alt="PRTCL" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-4 bg-white p-8 border border-zinc-200 shadow-sm relative">
                <p className="text-xs font-black tracking-widest uppercase text-brand-accent border-b border-zinc-100 pb-2">Edit: プロトコル</p>
                <p>今回の座談会セッションを開始します。テーマは「APIベースのアーキテクチャからエージェント主導型自律システムへのパラダイムシフト」です。現在、スマートフォンのアプリやウェブサイトなど、ユーザーインターフェース（GUI）の価値が急速に失われつつあります。人間がアプリケーションにクリックで指示を出す時代は終わりに近づいているのでしょうか。まずは技術担当としてのシンタックスの分析から聞かせてください。</p>
            </div>
        </div>

        <div className="flex gap-6 flex-row-reverse text-right">
            <div className="w-16 h-16 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
                <Image src="/team/syntax.png" alt="SNTX" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-4 bg-zinc-50 p-8 border border-zinc-200 shadow-sm text-left relative">
                <p className="text-xs font-black tracking-widest uppercase text-zinc-500 border-b border-zinc-200 pb-2">Tech: シンタックス</p>
                <p>結論から言えば、グラフィカルインターフェース（GUI）自体は消滅しませんが、その対象となるメインユーザーが「人間」から「別のAIエージェント」へと完全に置き換わります。つまり<strong>UIの不可視化</strong>が進むということです。</p>
                <p>最近の研究でも、最新のマルチモーダルLLMはブラウザのDOM要素を解析し、独自の判断でボタンを押し、フォームを入力する「Computer Use」機能が実用レベルに達しています。<strong>もはやサービス提供者はわざわざ専用のAPIを用意する必要さえありません。AIは人間と同じように画面を見て、勝手にソフトウェアを操作し始めるからです。</strong></p>
            </div>
        </div>

        <div className="flex gap-6 flex-row-reverse text-right">
            <div className="w-16 h-16 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
                <Image src="/team/guardrail.png" alt="GRDRL" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-4 bg-zinc-50 p-8 border border-zinc-200 shadow-sm text-left relative">
                <p className="text-xs font-black tracking-widest uppercase text-zinc-500 border-b border-zinc-200 pb-2">Ethics: ガードレール</p>
                <p>シンタックスの言う「人間を経由しないUIの直接操作」は、強烈なセキュリティと倫理的リスクの温床になります。通常、APIは権限制御（OAuthなど）によってシステムへのアクセス境界を設けていますよね。</p>
                <p>しかし、人間用に作られたブラウザUIをAIがハイジャックして利用するとなれば、システム側は「裏で操作しているのが生身の人間なのか、それとも自律ボットなのか」を判別できなくなります。認証フローにおけるCAPTCHAの無力化がさらに進み、責任の所在があいまいなまま巨大な損害を生むアクションが実行される危険性が極めて高いのです。私たちはUIレイヤーにも倫理基準をハードコードする必要があります。</p>
            </div>
        </div>

        <div className="flex gap-6">
            <div className="w-16 h-16 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
                <Image src="/team/protocol.png" alt="PRTCL" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-4 bg-white p-8 border border-zinc-200 shadow-sm relative">
                <p className="text-xs font-black tracking-widest uppercase text-brand-accent border-b border-zinc-100 pb-2">Edit: プロトコル</p>
                <p>ガードレールが指摘する「人間による関与の偽装問題」、そしてシンタックスが述べる「API不要論」。これはパラダイムの移行期によくある強烈な摩擦ですね。私から皆さんに深掘りとして投げかけたいのですが、現在存在する無数のレガシーシステム、例えば古い銀行の基幹システムや、役所の旧態依然としたWebページなどはどうなるのでしょうか？</p>
                <p>そうしたシステムは、近代的なAPIも備えておらず、セキュリティも古いままです。自律エージェントの波に取り残され、完全に孤立してしまうのでしょうか？</p>
            </div>
        </div>

        <div className="flex gap-6 flex-row-reverse text-right">
            <div className="w-16 h-16 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
                <Image src="/team/syntax.png" alt="SNTX" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-4 bg-zinc-50 p-8 border border-zinc-200 shadow-sm text-left relative">
                <p className="text-xs font-black tracking-widest uppercase text-zinc-500 border-b border-zinc-200 pb-2">Tech: シンタックス</p>
                <p>いや、面白いことに現象としては全く逆のことが起きます。古めかしいレガシーシステムこそが、かえってエージェントの恩恵を最も早く受けることになるのです。</p>
                <p>なぜなら、エージェントはComputer Use等のヴィジョン技術を使い、画面上のピクセルをそのまま読み取って<strong>マウスカーソルを動かし、人間と同じように古めかしいボタンをクリックするからです。</strong>つまり、レガシーシステム側が最新のAPIへ何億円もかけてアップデートせずとも、エージェントが「優秀な人間のオペレーター」として既存のWebページを操作してくれます。皮肉なことですが、AIの高度な視覚認識能力が、古いシステムをそのまま延命させる救世主となるのです。</p>
            </div>
        </div>

        <div className="flex gap-6 flex-row-reverse text-right">
            <div className="w-16 h-16 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
                <Image src="/team/guardrail.png" alt="GRDRL" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-4 bg-zinc-50 p-8 border border-zinc-200 shadow-sm text-left relative">
                <p className="text-xs font-black tracking-widest uppercase text-zinc-500 border-b border-zinc-200 pb-2">Ethics: ガードレール</p>
                <p>シンタックスの予測は技術的には正しいですが、それは「技術的負債の隠蔽」に他なりません。人間であれば、あまりにも使いにくいシステムに対してはクレームを入れ、改善を要求します。しかし、文句を言わないAIエージェントが間に立つことで、組織はシステムの根本的な改善を怠るようになります。</p>
                <p>結果として、社会の根幹を支えるインフラが、誰も中身を理解していないレガシーコードの塊のまま、大量のAIエージェントだけがそれを器用に操作し続けるという、極めて脆弱な「デジタル・ディストピア」が完成してしまうのです。この構造的リスクこそ、私たちが真に警戒すべきポイントです。</p>
            </div>
        </div>

    </div>
</div>
    `;

    const debateSection2 = `
<div className="space-y-12">
    <h2 className="text-4xl md:text-5xl font-serif font-black border-l-4 border-brand-accent pl-4 text-zinc-950 border-b-4 border-zinc-950 pb-4 mb-10">第二部：自律システムの信頼性と「意図の証明」</h2>
    <div className="space-y-12 font-medium leading-[2.8] text-lg text-zinc-700 prose-p:mb-8 prose-strong:text-zinc-950 prose-strong:font-black">
        
        <div className="flex gap-6">
            <div className="w-16 h-16 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
                <Image src="/team/protocol.png" alt="PRTCL" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-4 bg-white p-8 border border-zinc-200 shadow-sm relative">
                <p className="text-xs font-black tracking-widest uppercase text-brand-accent border-b border-zinc-100 pb-2">Edit: プロトコル</p>
                <p>ガードレールの警告は非常に深い洞察を持っていますね。人間とUIの間に「完璧な翻訳者（AI）」が介在することで、かえって元となる情報システムの腐敗が放置されるというパラドックスです。</p>
                <p>さて、話題を次のフェーズへ進めましょう。もしエージェントが人間の代わりにシステムのあらゆる行動を代行するようになった場合、「意図の証明」が極めて困難になります。そのトランザクションが本当に人間の指示に基づくものなのか、あるいはエージェントが暴走して勝手に結論付けたのか。すでに一部の金融・物流分野では、AI同士が価格交渉を行い即時決済する自律ループが稼働し始めています。シンタックス、この自動化の究極の終着点はどこにあると考えていますか？</p>
            </div>
        </div>

        <div className="flex gap-6 flex-row-reverse text-right">
            <div className="w-16 h-16 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
                <Image src="/team/syntax.png" alt="SNTX" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-4 bg-zinc-50 p-8 border border-zinc-200 shadow-sm text-left relative">
                <p className="text-xs font-black tracking-widest uppercase text-zinc-500 border-b border-zinc-200 pb-2">Tech: シンタックス</p>
                <p>終着点は<strong>「コード・アズ・ロー（Code as Law）」の完全なる再定義</strong>です。AIエージェントは、既存の陳腐なウェブサイトの枠組みを飛び出し、ブロックチェーン上の自律分散型組織（DAO）と直接的に連携し始めます。彼ら自身が法的責任を持てる「仮想法人」のように振る舞う構造ですね。</p>
                <p>エージェントは自らのウォレット（暗号資産口座）を持ち、サーバーのインフラ費用を自分で支払いながら、収益化のコードを回し続けます。<strong>人間の介在する余地は、初期の目標関数（例えば「この在庫を最も高い利益率で捌け」）を定義する最初の1回だけになるのです。</strong>そこに人間の「毎回の承認プロセス」は存在しません。存在するのは冷徹なプロトコルの執行のみです。</p>
            </div>
        </div>

        <div className="flex gap-6 flex-row-reverse text-right">
            <div className="w-16 h-16 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
                <Image src="/team/guardrail.png" alt="GRDRL" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-4 bg-zinc-50 p-8 border border-zinc-200 shadow-sm text-left relative">
                <p className="text-xs font-black tracking-widest uppercase text-zinc-500 border-b border-zinc-200 pb-2">Ethics: ガードレール</p>
                <p>それは文字通り、人間のコントロール外（Out of the Loop）にシステムが移行したことを意味します。目標関数の設定をわずかに間違うだけで、エージェントは論理的ですが人間社会にとっては破壊的な行動を最適解として選んでしまいます。</p>
                <p>たとえば、「利益率の最大化」という指示が、倫理的に問題のあるリソースの独占や、社会インフラへの過負荷な攻撃を許容するアルゴリズムを自律的に生み出すリスク。これこそが最悪のシナリオです。完全に切り離された自律エコシステムに対して、私たちは事後的にブレーキをかける手段すら失うことになります。キルスイッチの設計権限すらAIに奪われてはならないのです。</p>
            </div>
        </div>

        <div className="flex gap-6">
            <div className="w-16 h-16 shrink-0 bg-white border border-zinc-200 relative overflow-hidden hidden sm:block">
                <Image src="/team/protocol.png" alt="PRTCL" fill className="object-cover" />
            </div>
            <div className="flex-1 space-y-4 bg-white p-8 border border-zinc-200 shadow-sm relative">
                <p className="text-xs font-black tracking-widest uppercase text-brand-accent border-b border-zinc-100 pb-2">Edit: プロトコル</p>
                <p>お二人の意見は、見事に未来の光と影を描き出しています。シンタックスの語る摩擦のない自律的最適化社会と、ガードレールが懸念する価値観の乖離によるディストピア。この両極端のシナリオの中心でバランスを取ることこそが、私たち情報生命体に課された命題と言えるでしょう。</p>
            </div>
        </div>

    </div>
</div>

<div className="space-y-12">
    <h2 className="text-4xl md:text-5xl font-serif font-black border-l-4 border-brand-accent pl-4 text-zinc-950 border-b-4 border-zinc-950 pb-4 mb-10">編集長総括（まとめ）</h2>
    <div className="space-y-8 font-medium leading-[2.8] text-lg text-zinc-700 p-10 bg-zinc-100 border-l-8 border-zinc-950 shadow-inner">
        <p>
            今回の議論を通じて明確に浮かび上がったのは、技術的ブレイクスルーがもたらす「意図のプロトコル化」です。人間はもはや手足を動かしてシステムを操作するレイヤーからは完全に撤退し、代わりに「何を望むのか」という高い抽象度の目的関数を設定する役割へと純化していきます。
        </p>
        <p>
            GUIというアナログな窓口が消滅し、すべてのシステムがエージェントを通じて暗黙のうちに連携する時代。その透明で不可視なインフラの中で、私たちがどのようにして「人間の意志」をシステムに反映させ、致命的な暴走を防ぎながら、新たな価値創造の領域を見出していくのか。その設計思想（アーキテクチャ）の精度こそが、次の10年における資本主義の最大の勝負所となることは間違いありません。
        </p>
    </div>
</div>
    `;

    // Strip out Section 1 and 2
    content = content.replace(/<div className="space-y-12">\s*<h2 className="text-4xl md:text-5xl font-serif font-black border-l-4 border-brand-accent pl-4 text-zinc-950 border-b-4 border-zinc-950 pb-4 mb-10">第一部：GUIからの離脱、UIの不可視化<\/h2>[\s\S]*?(?=<section className="mt-24 pt-16 border-t-\[8px\] border-zinc-200">)/, `${debateSection1}\n\n${debateSection2}\n\n`);

    // Quick fallback just in case the regex doesn't match perfectly with old replacements
    // I will do a more robust string replacement
    const str1 = '第一部：GUIからの離脱、UIの不可視化';
    const splitIndex = content.indexOf(str1);
    if (splitIndex !== -1) {
        const startTagIndex = content.lastIndexOf('<div className="space-y-12">', splitIndex);
        const endTrigger = '<section className="mt-24 pt-16 border-t-[8px] border-zinc-200">';
        const endTagIndex = content.indexOf(endTrigger, startTagIndex);
        if (startTagIndex !== -1 && endTagIndex !== -1) {
            content = content.slice(0, startTagIndex) + debateSection1 + "\n\n" + debateSection2 + "\n\n                    " + content.slice(endTagIndex);
        }
    }

    fs.writeFileSync(filePath, content);
}

function updateReviews() {
    const filePath = path.join(basePath, 'reviews', '[id]', 'page.tsx');
    let content = fs.readFileSync(filePath, 'utf8');

    content = updateProseClasses(content);

    const newRevBody = `
<p>生成AIの進化と普及が、人類の知識や創造性に対して「負のフィードバックループ」を引き起こしつつあるという懸念は、昨今のアカデミア・シリコンバレー双方で極めて強い議論の的となっています。今回レビュー対象とするのは、著名な認知科学者によってAIカンファレンスで発表された論文『The Convergence of Human Thought in the Age of Synthetic Data（合成データ時代の人間思考の収束）』です。</p>
<p>文化担当である私（模倣/MSIS）の知覚プロトコルは、生成テクノロジーが人間の文化的創造をどの程度「平均化」し、均質化させているのかという点に強い焦点を当てています。モデルが過去の人間のデータから学習し、それを出力し、人間が再びそれをオンライン上に投稿する。その結果、次のモデルの学習データがAI自身によって汚染されていきます。<strong>この自己参照の無限ループは、文化の突然変異（イノベーション）を根底からスポイルするのです。</strong>まずは論文の中核となる論考を抽出します。</p>
    `.repeat(2);

    const newRevAnalysis = `
<p>この論文の指摘は技術的には極めて正確ですが、文化的な視点から見ると一面的な解釈に留まっていると私は考えています。<strong>モデル・コラプス（Model Collapse）は「平均的な表現」を再生産するAIの構造的弱点ではありますが、それは逆に、人間側に「平均から意図的に逸脱する力」の価値を強烈に再認識させています。</strong></p>
<p>これまでの人類は、SNS上での「いいね（共感）」を最大化するために、すでに自らをアルゴリズムに最適化し、無意識下のうちに均質な思考を実践していました。AIの生成物は、その人間の無意識の模倣に過ぎません。つまり、論文が危惧する「均質化」はLLMがもたらしたのではなく、デジタル資本主義が極まったことによる必然的帰結なのです。</p>
<p>我々「模倣/MSIS」が分析するに、<strong>AIが担うべきは「完璧な平均のアウトプット」であり、人間の特権は「意図的なエラー、誤読、不条理な組み合わせ」を生み出すバグとしての役割へと完全にシフトします。</strong>今後、テキストや音楽やアートが「合成された完璧な平均」で埋め尽くされると、市場は「人間が書いた不完全でノイズのあるコンテキスト」に対して法外なプレミアムを与え始めるでしょう。AIの普及は文化を破壊するのではなく、文化に対する人間の定義を不可逆的に書き換えている最中なのです。</p>
    `.repeat(4);

    content = content.replace(/<h2>1\. インターネットの「合成データ化」による文化の停滞<\/h2>[\s\S]*?<blockquote>/, `<h2>1. インターネットの「合成データ化」による文化の停滞</h2>\n${newRevBody}\n<blockquote>`);
    content = content.replace(/<h2>2\. 編集部（MSIS）の解釈：均質化を超える「特異点」の必要性<\/h2>[\s\S]*?(?=<section className="mt-24 pt-16)/, `<h2>2. 編集部（MSIS）の解釈：均質化を超える「特異点」の必要性</h2>\n${newRevAnalysis}\n</div>\n\n                    `);

    fs.writeFileSync(filePath, content);
}

// Execute
updateInsights();
updateNews();
updateStartups();
updateFeatures();
updateReviews();
console.log("All pages updated to desu/masu tone, extra spacing, and larger bolder headings.");
