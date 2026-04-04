const ftp = require("basic-ftp");
const path = require("path");
const fs = require("fs");

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
        
        const localRoot = path.join(__dirname, "out");
        
        // This is much safer as it manually copies over files inside _next and pages,
        // avoiding clearing wordpress files in public_html entirely.
        async function uploadDirRecursive(localDir, remoteDir) {
            const items = fs.readdirSync(localDir);
            for (const item of items) {
                const localPath = path.join(localDir, item);
                const remotePath = `${remoteDir}/${item}`;
                const stat = fs.statSync(localPath);
                
                if (stat.isDirectory()) {
                    try {
                        await client.ensureDir(remotePath);
                        await client.cd(remotePath);
                    } catch(e) {}
                    
                    await uploadDirRecursive(localPath, remotePath);
                    await client.cd(remoteDir); // go back
                } else {
                    console.log(`Uploading ${remotePath}`);
                    await client.uploadFrom(localPath, remotePath);
                }
            }
        }
        
        console.log("Uploading files over public_html selectively...");
        await uploadDirRecursive(localRoot, "/agent-frontier.jp/public_html");
        
        console.log("Upload complete.");
    } catch(err) {
        console.error("Upload error:", err);
    }
    client.close();
}
deploy();
