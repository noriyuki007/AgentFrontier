const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

const uploads = [
    {
        local: "/Users/ishii/.gemini/antigravity/brain/6d96eb79-448f-4e29-a7c1-befbbd514159/news_nvidia_rubin_gpu_1772687646402.png",
        remote: "/agent-frontier.jp/public_html/tmp_upload/news_nvidia_rubin.png"
    },
    {
        local: "/Users/ishii/.gemini/antigravity/brain/6d96eb79-448f-4e29-a7c1-befbbd514159/news_openai_agent_api_1772687672978.png",
        remote: "/agent-frontier.jp/public_html/tmp_upload/news_openai_agent.png"
    },
    {
        local: "/Users/ishii/.gemini/antigravity/brain/6d96eb79-448f-4e29-a7c1-befbbd514159/news_ai_decision_making_1772687701410.png",
        remote: "/agent-frontier.jp/public_html/tmp_upload/news_ai_decision.png"
    },
];

async function deploy() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "sv16830.xserver.jp",
            user: "xs363809",
            password: "hr1gp1ho",
            secure: false
        });
        for (const u of uploads) {
            console.log("Uploading", path.basename(u.local));
            await client.uploadFrom(u.local, u.remote);
        }
        console.log("All done.");
    } finally {
        client.close();
    }
}
deploy();
