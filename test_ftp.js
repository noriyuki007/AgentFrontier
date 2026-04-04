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
        console.log("Connected to FTP server");
        await client.cd("/agent-frontier.jp");
        console.log("Listing /agent-frontier.jp:");
        const list1 = await client.list();
        for (const i of list1) console.log(i.name);
        
        await client.cd("public_html");
        console.log("Listing /agent-frontier.jp/public_html:");
        const list2 = await client.list();
        for (const i of list2) console.log(i.name);
    } catch(err) {
        console.error("Error:", err);
    } finally {
        client.close();
    }
}
run();
