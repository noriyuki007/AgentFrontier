const config = require('./autopost/config');

const WP_AUTH = Buffer.from(`${config.wp.user}:${config.wp.password}`).toString('base64');

async function testFetch() {
    const { default: fetch } = await import('node-fetch');
    console.log("Testing WP API Fetches...");
    const categories = [27, 1, 17, 25, 19];
    for (const catId of categories) {
        const url = `${config.wp.baseUrl}/posts?_embed&per_page=5&categories=${catId}`;
        console.log(`Fetching: ${url}`);
        const res = await fetch(url, {
            headers: { Authorization: `Basic ${WP_AUTH}` }
        });
        const text = await res.text();
        console.log(`Status: ${res.status}`);
        try {
            const posts = JSON.parse(text);
            console.log(`Category ${catId}: Found ${posts.length} posts`);
            if (posts.length > 0) {
                console.log(` - First post: ${posts[0].title.rendered}`);
            }
        } catch (e) {
            console.log(`Category ${catId}: FAILED TO PARSE JSON. Sample text: ${text.slice(0, 500)}`);
        }
    }
}

testFetch().catch(console.error);
