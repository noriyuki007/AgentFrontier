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
        await client.uploadFrom(path.join(__dirname, "fix_thumbs_batch2.php"), "fix_thumbs_batch2.php");

        console.log("Uploading images...");
        const imageDir = "/Users/ishii/.gemini/antigravity/brain/6d96eb79-448f-4e29-a7c1-befbbd514159";
        const images = [
            "future_workstyle_realism_1772681911387.png",
            "autonomous_media_editorial_1772681957753.png",
            "business_transformation_cinematic_1772682004926.png"
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
