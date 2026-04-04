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
    const ids = [3968, 3965, 3957, 3955, 3947];
    for (const id of ids) {
        const post = await getPostById(id);
        console.log(`ID: ${id} | Title: ${post.title.rendered} | Content Length: ${post.content.rendered.length}`);
    }
}

run().catch(console.error);
