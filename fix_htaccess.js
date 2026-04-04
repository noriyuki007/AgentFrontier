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
        await client.cd("/agent-frontier.jp/public_html");

        const htaccessContent = `
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
`;
        fs.writeFileSync(path.join(__dirname, ".htaccess_tmp2"), htaccessContent);
        await client.uploadFrom(path.join(__dirname, ".htaccess_tmp2"), ".htaccess");
        console.log("Uploaded .htaccess");
    } finally {
        client.close();
        if (fs.existsSync(path.join(__dirname, ".htaccess_tmp2"))) {
            fs.unlinkSync(path.join(__dirname, ".htaccess_tmp2"));
        }
    }
}
deploy();
