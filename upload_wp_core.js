const ftp = require("basic-ftp");
const path = require("path");

async function deployWp() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "sv16830.xserver.jp",
            user: "xs363809",
            password: "hr1gp1ho",
            secure: false
        });

        console.log("Uploading WordPress core files...");
        const wpPath = "/Users/ishii/Documents/Antigravity/AgentFrontier/wordpress";

        // We need to upload the files in the wordpress directory to the public_html root
        // But we want to be careful not to overwrite the Next.js files if possible
        // Actually, WP and Next.js can coexist if they don't have filename collisions
        // Next.js produces index.html, WP has index.php

        await client.uploadDir(wpPath, "/agent-frontier.jp/public_html");
        console.log("WordPress files uploaded.");

    } finally {
        client.close();
    }
}
deployWp().catch(console.error);
