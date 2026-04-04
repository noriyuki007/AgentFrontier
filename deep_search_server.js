const ftp = require("basic-ftp");

async function deepSearch() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: "sv16830.xserver.jp",
            user: "xs363809",
            password: "hr1gp1ho",
            secure: false
        });

        const dirs = ['/agent-frontier.jp', '/agent-frontier.jp/public_html', '/agent-frontier.jp/public_html/insights'];
        for (const dir of dirs) {
            console.log(`\nListing: ${dir}`);
            try {
                await client.cd(dir);
                const list = await client.list();
                console.log(list.map(f => `${f.type === 2 ? '[D]' : '[F]'} ${f.name}`));
            } catch (e) {
                console.log(`Failed to cd to ${dir}`);
            }
        }
    } finally {
        client.close();
    }
}
deepSearch().catch(console.error);
