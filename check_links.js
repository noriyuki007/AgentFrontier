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
        console.log(`ID: ${id} | Title: ${post.title.rendered} | Slug: ${post.slug} | Link: ${post.link}`);
    }
}

run().catch(console.error);
