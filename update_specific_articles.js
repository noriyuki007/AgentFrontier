const config = require('./autopost/config');
const { generateArticle } = require('./autopost/generator');
const personas = require('./autopost/personas');

const WP_AUTH = Buffer.from(`${config.wp.user}:${config.wp.password}`).toString('base64');

async function getPostById(postId) {
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(`${config.wp.baseUrl}/posts/${postId}`, {
        headers: { Authorization: `Basic ${WP_AUTH}` }
    });
    return await res.json();
}

async function updatePostContent(postId, content) {
    const { default: fetch } = await import('node-fetch');
    const body = { content };
    const res = await fetch(`${config.wp.baseUrl}/posts/${postId}`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${WP_AUTH}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    return data;
}

// remove unwanted text
async function removeUnwantedText(postId) {
    console.log(`Checking post ${postId} for unwanted text...`);
    const post = await getPostById(postId);
    if (!post || !post.content) return;

    let content = post.content.rendered;

    // Pattern to look for
    const targetPattern = /まだ自社のフェーズに迷っていますか？/g;

    if (targetPattern.test(content)) {
        console.log(`Found unwanted text in post ${postId}. Removing...`);

        // Remove the block
        let newContent = content.replace(/<p><strong>まだ自社のフェーズに迷っていますか？<\/strong><\/p>[\s\S]*?<p>あなたの組織体に最適な自律型AIエージェントの構成を、嘘のないデータで診断します。<\/p>[\s\S]*?<p><a[^>]*>10秒でAI指揮官を特定する（無料診断）<\/a><\/p>/g, '');

        // Generic cleanup
        newContent = newContent.replace(/まだ自社のフェーズに迷っていますか？/g, '');
        newContent = newContent.replace(/あなたの組織体に最適な自律型AIエージェントの構成を、嘘のないデータで診断します。/g, '');
        newContent = newContent.replace(/10秒でAI指揮官を特定する（無料診断）/g, '');

        // Clean up empty tags left behind
        newContent = newContent.replace(/<p><strong><\/strong><\/p>/g, '');
        newContent = newContent.replace(/<p><\/p>/g, '');
        newContent = newContent.replace(/<p><a[^>]*><\/a><\/p>/g, '');

        await updatePostContent(postId, newContent);
        console.log(`Successfully removed unwanted text from post ${postId}.`);
    } else {
        console.log(`No unwanted text found in post ${postId}.`);
    }
}

async function run() {
    // 1. Remove unwanted text from 3868 and category 17 (Startup)
    await removeUnwantedText(3868);

    const { default: fetch } = await import('node-fetch');
    const res = await fetch(`${config.wp.baseUrl}/posts?categories=17&per_page=100`, {
        headers: { Authorization: `Basic ${WP_AUTH}` }
    });
    const startupPosts = await res.json();
    for (const post of startupPosts) {
        await removeUnwantedText(post.id);
    }

    // 2. Complete 3972 (Review)
    console.log("Generating content for 3972...");
    const article3972Topic = {
        title: "人間とAIエージェントの信頼関係：UX/UIを超えたメンタルモデル",
        source: "Agent Frontier Internal",
        summary: "人間がAIエージェントを信頼する心理的メカニズムについて。単なる便利なツールから「自律的な同僚」へと昇格する際、どのようなUXデザインやメンタルモデルが必要になるのかを論じる。不透明性への不安、過剰信頼などの課題と、それを解決するための関係性デザイン。",
        url: "https://agent-frontier.jp"
    };
    const generated3972 = await generateArticle(personas.PERSONAS.SNTX, article3972Topic, "review", 0.6);
    await updatePostContent(3972, generated3972.content);
    console.log("Updated 3972 content.");

    // 3. Complete 3961 (Review)
    console.log("Generating content for 3961...");
    const article3961Topic = {
        title: "AI評価の裏側：忖度ゼロで選ぶ最高性能のLLM",
        source: "Agent Frontier Internal",
        summary: "現在最も性能の高いLLMはどれか。ベンチマークの罠を避け、実際のビジネス環境（プログラミング、論理推論、データ分析、エージェントワークフロー）において本当に使えるモデルを忖度なしでレビューする。プロンプトエンジニアリングの観点からも比較。",
        url: "https://agent-frontier.jp"
    };
    const generated3961 = await generateArticle(personas.PERSONAS.GRPH, article3961Topic, "review", 0.7);
    await updatePostContent(3961, generated3961.content);
    console.log("Updated 3961 content.");

    // 4. Complete "AIスタートアップ最前線" articles (Category 17)
    for (const post of startupPosts) {
        // Skip if content is already long (more than 1000 chars)
        if (post.content.rendered.length > 2000) {
            console.log(`Post ${post.id} already has content. Skipping generation.`);
            continue;
        }

        console.log(`Generating content for Startup post ${post.id}: ${post.title.rendered}...`);
        const topic = {
            title: post.title.rendered,
            source: "Agent Frontier Research",
            summary: post.excerpt.rendered || post.title.rendered,
            url: post.link
        };

        // Select an appropriate persona
        const persona = personas.PERSONAS.SGNL; // Default for startups
        const generated = await generateArticle(persona, topic, "startup", 0.6);
        await updatePostContent(post.id, generated.content);
        console.log(`Updated post ${post.id} content.`);
    }
}

run().catch(console.error);
