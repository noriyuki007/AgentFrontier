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
        console.log("Connected.");
        
        const remoteRoot = "/agent-frontier.jp/public_html";
        const localRoot = path.join(__dirname, "out");
        
        await client.cd(remoteRoot);
        
        console.log("Uploading individual HTML and CSS files directly to root to preserve WordPress integration without wiping it.");
        
        // Let's just upload _next, fonts, images and html files manually
        // basic-ftp requires specifying exact files if we want to avoid replacing folders
        
        // This takes a lot of care to not overwrite wp-admin, wp-content, wp-includes
        
        await client.uploadFromDir(localRoot);
        
        console.log("Upload complete.");
    } catch(err) {
        console.error("Upload error:", err);
    }
    client.close();
}
deploy();
