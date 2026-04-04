const ftp = require("basic-ftp");

async function checkHtaccess() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "sv16830.xserver.jp",
            user: "xs363809",
            password: "hr1gp1ho",
            secure: false
        });
        await client.cd("/agent-frontier.jp/public_html");

        console.log("Checking for index.php and wp-load.php...");
        const list = await client.list();
        const files = list.map(f => f.name);
        console.log("Files in public_html:", files);

        if (files.includes("index.php")) console.log("index.php found");
        if (files.includes("wp-json")) console.log("wp-json found (directory)");

        console.log("\nReading .htaccess...");
        await client.downloadTo("htaccess_downloaded.txt", ".htaccess");
        const fs = require('fs');
        const content = fs.readFileSync("htaccess_downloaded.txt", "utf8");
        console.log("Current .htaccess content:\n", content);

    } finally {
        client.close();
    }
}
checkHtaccess().catch(console.error);
