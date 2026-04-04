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
        
        await client.cd("/agent-frontier.jp/public_html");
        
        console.log("Uploading files to public_html...");
        
        await client.uploadFromDir(__dirname + "/out");
        
        console.log("Upload complete.");
    } catch(err) {
        console.error("Upload error:", err);
    }
    client.close();
}
deploy();
