const config = require('./autopost/config');
const WP_AUTH = Buffer.from(`${config.wp.user}:${config.wp.password}`).toString('base64');

async function getPostById(postId) {
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(`${config.wp.baseUrl}/posts/${postId}?context=edit`, {
        headers: { Authorization: `Basic ${WP_AUTH}` }
    });
    return await res.json();
}

async function run() {
    const ids = [3868, 3972, 3961];
    for (const id of ids) {
        const post = await getPostById(id);
        console.log(`\n--- ID: ${id} | Title: ${post.title.rendered} ---`);
        console.log(`Content Length: ${post.content.raw.length}`);
        console.log(`Content Sample (Last 1000 chars):\n${post.content.raw.slice(-1000)}`);

        if (post.content.raw.includes('まだ自社のフェーズに迷っていますか？')) {
            console.log(">> [FOUND] Unwanted text found in RAW content.");
        } else {
            console.log(">> [NOT FOUND] Unwanted text not found in RAW content.");
        }
    }
}

run().catch(console.error);
