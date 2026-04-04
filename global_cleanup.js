const config = require('./autopost/config');
const WP_AUTH = Buffer.from(`${config.wp.user}:${config.wp.password}`).toString('base64');

async function getAllPosts() {
    const { default: fetch } = await import('node-fetch');
    let allPosts = [];
    let page = 1;
    while (true) {
        const res = await fetch(`${config.wp.baseUrl}/posts?per_page=100&page=${page}`, {
            headers: { Authorization: `Basic ${WP_AUTH}` }
        });
        if (!res.ok) break;
        const posts = await res.json();
        if (posts.length === 0) break;
        allPosts = allPosts.concat(posts);
        page++;
    }
    return allPosts;
}

async function updatePostContent(postId, content) {
    const { default: fetch } = await import('node-fetch');
    const body = { content };
    await fetch(`${config.wp.baseUrl}/posts/${postId}`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${WP_AUTH}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
    });
}

async function run() {
    const posts = await getAllPosts();
    console.log(`Searching through ${posts.length} posts...`);
    for (const post of posts) {
        const content = post.content.rendered;
        if (content.includes('まだ自社のフェーズに迷っていますか？')) {
            console.log(`Found unwanted text in post ${post.id}. Cleaning...`);
            let newContent = content.replace(/<p><strong>まだ自社のフェーズに迷っていますか？<\/strong><\/p>[\s\S]*?<p>あなたの組織体に最適な自律型AIエージェントの構成を、嘘のないデータで診断します。<\/p>[\s\S]*?<p><a[^>]*>10秒でAI指揮官を特定する（無料診断）<\/a><\/p>/g, '');
            newContent = newContent.replace(/まだ自社のフェーズに迷っていますか？/g, '');
            newContent = newContent.replace(/あなたの組織体に最適な自律型AIエージェントの構成を、嘘のないデータで診断します。/g, '');
            newContent = newContent.replace(/10秒でAI指揮官を特定する（無料診断）/g, '');
            newContent = newContent.replace(/<p><strong><\/strong><\/p>/g, '');
            newContent = newContent.replace(/<p><\/p>/g, '');

            await updatePostContent(post.id, newContent);
            console.log(`Post ${post.id} cleaned.`);
        }
    }
    console.log("Sweep complete.");
}

run().catch(console.error);
