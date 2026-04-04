const ftp = require('basic-ftp');
const fs = require('fs');

async function run() {
    const client = new ftp.Client();
    try {
        await client.access({
            host: 'sv16830.xserver.jp',
            user: 'xs363809',
            password: 'hr1gp1ho',
            secure: false
        });

        const content = `
RewriteEngine On
RewriteCond %{HTTP:Authorization} ^(.*)
RewriteRule ^(.*) - [E=HTTP_AUTHORIZATION:%1]

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
        fs.writeFileSync('/tmp/.htaccess_new', content.trim());
        await client.uploadFrom('/tmp/.htaccess_new', '/agent-frontier.jp/public_html/.htaccess');
        console.log('.htaccess updated with Authorization pass-through');
    } catch (e) {
        console.error(e);
    }
    client.close();
}
run();
