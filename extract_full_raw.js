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
    // Write full content to a file so I can grep it locally
    require('fs').writeFileSync('./post_3868_raw.html', post.content.raw);
    console.log("Full raw content written to post_3868_raw.html");
}

run().catch(console.error);
