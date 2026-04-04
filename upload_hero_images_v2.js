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
        // Check if tmp_upload exists, if not create it
        try {
            await client.ensureDir("tmp_upload");
        } catch (e) {
            console.log("ensureDir failed, trying to create manually");
        }

        await client.cd("/agent-frontier.jp/public_html");

        console.log("Uploading script...");
        await client.uploadFrom(path.join(__dirname, "fix_media_thumbs.php"), "fix_media_thumbs.php");

        console.log("Uploading images...");
        const imageDir = "/Users/ishii/.gemini/antigravity/brain/6d96eb79-448f-4e29-a7c1-befbbd514159";
        const images = [
            "discussion_hero_editorial_1772682555166.png",
            "ai_trend_media_editorial_v2_1772682600677.png"
        ];

        for (const img of images) {
            // Upload to absolute path to be safe
            await client.uploadFrom(path.join(imageDir, img), `/agent-frontier.jp/public_html/tmp_upload/${img}`);
            console.log(`Uploaded ${img}`);
        }

    } catch (err) {
        console.error("FTP Error:", err);
    } finally {
        client.close();
    }
}
deploy();
