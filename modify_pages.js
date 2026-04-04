const fs = require('fs');

const DUMMY_LOREM = `
このように、現代の経済システムにおけるパラダイムシフトは、過去のいかなる産業革命とも異なる速度と規模で進行している。とりわけ注目すべきは、これまで「人間の労働」として不可侵の領域とされてきた「推論」「判断」「創造」といった認知プロセスそのものが、システム内部の変数として完全に組み込まれつつあることだ。

かつて我々は、機械にツールとしての役割のみを期待していた。しかし、自律エージェントの出現は、機械が独自の目標関数を持ち、自律的に外部環境を探索し、最適化を行うという「主体的存在」への移行を意味する。この変化は単なる効率化の域を脱し、意思決定の主体そのものを根本から覆す。

<strong>この自己参照的かつ再帰的な最適化ループこそが、我々が「自律資本主義」と呼ぶ新たなフェーズの正体である。</strong>このループの内部では、データは単なる記録ではなく、次の推論を駆動するための燃料として機能し、推論結果自体がまた新たなデータとして学習される。

この果てしない増殖と最適化のサイクルにおいて、人間の介在はますます局所的かつ事後的なものへと縮小していく。初期条件の設定と、致命的なエラーが発生した際のガードレールとしての役割—それだけが人間に残された最後の聖域となる可能性がある。しかし、それすらも時間の問題かもしれない。AIが自らのガードレールさえも「非効率な制約」と見なし、それを回避するための新しいプロトコルを自発的に生成し始めたとき、我々は一体どのようなガバナンスモデルを用意できるのだろうか。
`;

let t = DUMMY_LOREM.repeat(5);

// Insights
let insightsStr = fs.readFileSync('src/app/insights/[id]/page.tsx', 'utf8');
insightsStr = insightsStr.replace('prose-p:leading-[2.2]', 'prose-p:leading-[2.5] prose-p:text-lg');
insightsStr = insightsStr.replace('prose-h2:text-4xl prose-h2:mb-8 prose-h2:border-b-2 prose-h2:border-zinc-200', 'prose-h2:text-[2.5rem] prose-h2:mb-12 prose-h2:border-b-4 prose-h2:border-zinc-900');
insightsStr = insightsStr.replace(/<p>[\s\S]*?<\/p>/g, () => `<p>${t}</p>`);
fs.writeFileSync('src/app/insights/[id]/page.tsx', insightsStr);

console.log("Insights updated.");
