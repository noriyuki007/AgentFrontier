const ftp = require("basic-ftp");
const fs = require('fs');

async function downloadWpContent() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "sv16830.xserver.jp",
            user: "xs363809",
            password: "hr1gp1ho",
            secure: false
        });

        console.log("Downloading index.php for inspection...");
        await client.downloadTo("index_server.php", "/agent-frontier.jp/public_html/index.php");
        const content = fs.readFileSync("index_server.php", "utf8");
        console.log("index.php content:\n", content);

    } finally {
        client.close();
    }
}
downloadWpContent().catch(console.error);
