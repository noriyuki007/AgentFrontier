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
    const post = await getPostById(3868);
    console.log(JSON.stringify(post, (key, value) => {
        if (typeof value === 'string' && value.includes('まだ自社のフェーズに迷っていますか？')) {
            return `--- FOUND IN KEY: ${key} ---`;
        }
        return value;
    }, 2));
}

run().catch(console.error);
