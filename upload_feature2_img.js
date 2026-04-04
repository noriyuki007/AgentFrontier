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
        console.log("Uploading new feature 2 image...");
        await client.uploadFrom(
            "/Users/ishii/.gemini/antigravity/brain/6d96eb79-448f-4e29-a7c1-befbbd514159/agent_economy_protocol_feature_1772686777767.png",
            "/agent-frontier.jp/public_html/tmp_upload/agent_economy_protocol_feature.png"
        );
        console.log("Done.");
    } finally {
        client.close();
    }
}
deploy();
