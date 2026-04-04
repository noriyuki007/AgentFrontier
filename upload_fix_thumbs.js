const ftp = require("basic-ftp");
const path = require("path");

async function deploy() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "sv16830.xserver.jp",
            user: "xs363809",
            password: "hr1gp1ho",
            secure: false
        });
        await client.cd("/agent-frontier.jp/public_html");
        await client.ensureDir("tmp_upload");
        await client.cd("/agent-frontier.jp/public_html");

        console.log("Uploading script...");
        await client.uploadFrom(path.join(__dirname, "fix_thumbnails.php"), "fix_thumbnails.php");

        console.log("Uploading images...");
        const imageDir = "/Users/ishii/.gemini/antigravity/brain/6d96eb79-448f-4e29-a7c1-befbbd514159";
        const images = [
            "ai_artist_collab_thumb_1772681244289.png",
            "green_ai_efficiency_thumb_1772681271870.png",
            "ai_governance_thumb_1772681303251.png",
            "human_ai_trust_thumb_new_1772681339300.png",
            "agent_economy_thumb_v2_1772681374307.png"
        ];

        for (const img of images) {
            await client.uploadFrom(path.join(imageDir, img), `tmp_upload/${img}`);
            console.log(`Uploaded ${img}`);
        }

    } finally {
        client.close();
    }
}
deploy();
