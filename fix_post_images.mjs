import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

let POST_IDS = [
    // Will be populated dynamically
];

async function fetchRecentPostIds() {
    try {
        const res = await fetch(`https://agent-frontier.jp/wp-json/wp/v2/posts?per_page=40`);
        const posts = await res.json();
        return posts.map(p => p.id);
    } catch (e) {
        console.error("Failed to fetch recent posts", e);
        return [];
    }
}

const GEMINI_API_KEY = "AIzaSyBw1VFoLcsjun9TRLADi6Hcoi_8wlhFpks";
const BRIDGE_KEY = "AGENT_FRONTIER_BYPASS_2026";
const BRIDGE_URL = "https://agent-frontier.jp/wp-bridge.php";
const WP_USER = "noriyuki007";
const WP_PASS = "jSFk 3tTk JZtm hBGq j6He da3b";
const WP_API_URL = "https://agent-frontier.jp/wp-json/wp/v2";

async function getPostTitle(id) {
    try {
        const res = await fetch(`https://agent-frontier.jp/wp-json/wp/v2/posts/${id}`);
        const data = await res.json();
        return data.title.rendered;
    } catch (e) {
        console.error(`Failed to fetch title for ${id}`, e);
        return null;
    }
}

async function generateImage(id, title) {
    console.log(`Generating image for ${id}: ${title}`);
    
    // Curated high-quality tech/AI images from Unsplash to ensure "Premium" look
    const gallery = [
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e", // AI Robot
        "https://images.unsplash.com/photo-1518770660439-4636190af475", // Circuitry
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa", // Global Network
        "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1", // Neural/Brain
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b", // Cyber Security
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1", // High Tech Laptop
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0", // Futuristic
        "https://images.unsplash.com/photo-1551288049-bbbda5366392", // Data Viz
    ];

    // Pick a different image based on the ID to avoid duplicates
    const imageUrl = `${gallery[id % gallery.length]}?auto=format&fit=crop&q=80&w=1200&h=675`;
    
    try {
        const imgRes = await fetch(imageUrl);
        const buffer = await imgRes.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return {
            mimeType: 'image/jpeg',
            data: base64
        };
    } catch (e) {
        console.error("Image fetch failed", e);
        return null;
    }
}

async function uploadMedia(base64Data, filename, mimeType) {
    const auth = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
    const binData = Buffer.from(base64Data, 'base64');

    try {
        const res = await fetch(`${BRIDGE_URL}?action=media&key=${BRIDGE_KEY}&filename=${filename}`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': mimeType || 'image/png',
            },
            body: binData,
        });

        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    } catch (e) {
        console.error("Upload failed", e);
        return null;
    }
}

async function updatePost(postId, mediaId) {
    const auth = Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');
    const body = {
        id: postId,
        featured_media: mediaId
    };

    try {
        const res = await fetch(`${BRIDGE_URL}?action=posts&key=${BRIDGE_KEY}`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    } catch (e) {
        console.error("Post update failed", e);
        return null;
    }
}

async function main() {
    POST_IDS = await fetchRecentPostIds();
    console.log(`Starting fix for ${POST_IDS.length} posts...`);
    const ROBOT_BENCH_ID = "1620712943543-bcc4688e7485";

    const FORCE_IDS = [4255, 4272, 4270, 4264, 4258];

    for (const id of POST_IDS) {
        try {
            const res = await fetch(`${WP_API_URL}/posts/${id}?_embed`);
            const post = await res.json();
            if (!post || !post.title) {
                console.warn(`Post ${id} not found or invalid response.`);
                continue;
            }
            const currentImg = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "";
            const title = post.title.rendered;

            if (FORCE_IDS.includes(id) || currentImg.includes(ROBOT_BENCH_ID) || !currentImg || currentImg.includes("placeholder.jpg")) {
                console.log(`Post ${id} ("${title}") is forced or has duplicate/missing image. Fixing...`);
            } else {
                console.log(`Post ${id} already has a unique image. Skipping.`);
                continue;
            }

            const image = await generateImage(id, title);
            if (!image) continue;

            const ext = image.mimeType.split('/')[1] || 'png';
            const media = await uploadMedia(image.data, `fix_${id}_${Date.now()}.${ext}`, image.mimeType);
            if (media && media.id) {
                console.log(`Successfully uploaded media ${media.id} for post ${id}`);
                await updatePost(id, media.id);
                console.log(`Successfully updated post ${id}`);
            }
        } catch (err) {
            console.error(`Error processing post ${id}:`, err.message);
        }
        await new Promise(r => setTimeout(r, 1000));
    }
}

main();
