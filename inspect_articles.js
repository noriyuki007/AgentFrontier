const config = require('./autopost/config');

const WP_AUTH = Buffer.from(`${config.wp.user}:${config.wp.password}`).toString('base64');

async function getPostsInCategory(categoryId) {
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(`${config.wp.baseUrl}/posts?categories=${categoryId}&per_page=100&_fields=id,title`, {
        headers: { Authorization: `Basic ${WP_AUTH}` }
    });
    return await res.json();
}

async function getPostById(postId) {
    const { default: fetch } = await import('node-fetch');
    const res = await fetch(`${config.wp.baseUrl}/posts/${postId}?_fields=id,title,categories`, {
        headers: { Authorization: `Basic ${WP_AUTH}` }
    });
    return await res.json();
}

async function run() {
    console.log("--- Specific Articles ---");
    const ids = [3868, 3972, 3961];
    for (const id of ids) {
        const post = await getPostById(id);
        if (post.id) {
            console.log(`ID: ${post.id} | Title: ${post.title.rendered} | Categories: ${post.categories}`);
        } else {
            console.log(`ID: ${id} | NOT FOUND | response: ${JSON.stringify(post)}`);
        }
    }

    console.log("\n--- AIスタートアップ最前線 Articles (Category 17) ---");
    const startupPosts = await getPostsInCategory(17);
    for (const post of startupPosts) {
        console.log(`ID: ${post.id} | Title: ${post.title.rendered}`);
    }
}

run().catch(console.error);
