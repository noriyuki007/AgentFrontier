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
        console.log("Connected to FTP server");
        await client.cd("/agent-frontier.jp/public_html");

        // Upload missing files
        const wpPath = path.join(__dirname, "wordpress");
        const filesToUpload = [
            "index.php",
            "wp-activate.php",
            "wp-blog-header.php",
            "wp-comments-post.php",
            "wp-cron.php",
            "wp-links-opml.php",
            "wp-load.php",
            "wp-login.php",
            "wp-mail.php",
            "wp-settings.php",
            "wp-signup.php",
            "wp-trackback.php",
            "xmlrpc.php"
        ];
        
        for (const file of filesToUpload) {
            console.log("Uploading", file);
            await client.uploadFrom(path.join(wpPath, file), file);
        }

        console.log("Uploading wp-admin and wp-includes...");
        await client.ensureDir("wp-admin");
        await client.uploadFromDir(path.join(wpPath, "wp-admin"));
        await client.cd("..");
        
        await client.ensureDir("wp-includes");
        await client.uploadFromDir(path.join(wpPath, "wp-includes"));
        await client.cd("..");

        // Upload standard .htaccess
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
        fs.writeFileSync(path.join(__dirname, ".htaccess_tmp"), htaccessContent);
        console.log("Uploading .htaccess");
        await client.uploadFrom(path.join(__dirname, ".htaccess_tmp"), ".htaccess");

        console.log("WordPress core restored.");
    } catch(err) {
        console.error("Error:", err);
    } finally {
        client.close();
        if (fs.existsSync(path.join(__dirname, ".htaccess_tmp"))) {
            fs.unlinkSync(path.join(__dirname, ".htaccess_tmp"));
        }
    }
}
deploy();
