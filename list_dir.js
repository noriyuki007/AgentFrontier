const ftp = require("basic-ftp");
async function run() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "sv16830.xserver.jp",
            user: "xs363809",
            password: "hr1gp1ho",
            secure: false
        });
        const list = await client.list("/agent-frontier.jp/public_html");
        for (const item of list) {
            console.log(item.name);
        }
    } finally {
        client.close();
    }
}
run();
