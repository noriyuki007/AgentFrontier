const config = require('./autopost/config');
const WP_AUTH = Buffer.from(`${config.wp.user}:${config.wp.password}`).toString('base64');

async function getPostById(postId) {
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(`${config.wp.baseUrl}/posts/${postId}`, {
        headers: { Authorization: `Basic ${WP_AUTH}` }
    });
    return await res.json();
}

async function run() {
    const ids = [3868, 3972, 3961];
    for (const id of ids) {
        const post = await getPostById(id);
        console.log(`\n--- ID: ${id} | Title: ${post.title.rendered} ---`);
        console.log(`Rendered Content Length: ${post.content.rendered.length}`);
        console.log(`Rendered Content Sample (Last 500 chars):\n${post.content.rendered.slice(-500)}`);
    }
}

run().catch(console.error);
