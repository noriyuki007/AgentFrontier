const ftp = require("basic-ftp");
const path = require("path");

async function uploadBridge() {
    const client = new ftp.Client();
    client.ftp.verbose = true;
    try {
        await client.access({
            host: "sv16830.xserver.jp",
            user: "xs363809",
            password: "hr1gp1ho",
            secure: false
        });
        console.log("Connected to FTP server");
        await client.cd("/agent-frontier.jp/public_html");

        const fs = require('fs');
        const files = fs.readdirSync(path.join(__dirname, "public")).filter(f => f.endsWith('.php') || f === '.user.ini');
        for (const file of files) {
            console.log(`Uploading ${file}...`);
            await client.uploadFrom(path.join(__dirname, "public", file), file);
        }

        console.log("Upload SUCCESSFUL!");
    } catch (err) {
        console.error("Error during FTP upload:", err);
    } finally {
        client.close();
    }
}

uploadBridge();
