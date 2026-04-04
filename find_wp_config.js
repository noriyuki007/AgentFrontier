const ftp = require("basic-ftp");
const fs = require('fs');

async function downloadWpConfig() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "sv16830.xserver.jp",
            user: "xs363809",
            password: "hr1gp1ho",
            secure: false
        });

        // Try various locations where wp-config.php might be
        const locations = [
            "/agent-frontier.jp/public_html/wp-config.php",
            "/agent-frontier.jp/wp-config.php",
            "/wp-config.php",
            "wp-config.php"
        ];

        for (const loc of locations) {
            console.log(`Checking: ${loc}`);
            try {
                await client.downloadTo("wp-config-found.php", loc);
                console.log(`SUCCESS: Found at ${loc}`);
                return;
            } catch (e) {
                console.log(`Not found at ${loc}`);
            }
        }

        console.log("Could not find wp-config.php in standard locations. Searching root...");
        await client.cd("/");
        const rootList = await client.list();
        console.log("Root files:", rootList.map(f => f.name));

    } finally {
        client.close();
    }
}
downloadWpConfig().catch(console.error);
