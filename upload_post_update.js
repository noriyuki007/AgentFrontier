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
        console.log("Uploading update script...");
        await client.uploadFrom(
            path.join(__dirname, "update_posts_batch.php"),
            "/agent-frontier.jp/public_html/update_posts_batch.php"
        );
        console.log("Done.");
    } finally {
        client.close();
    }
}
deploy();
