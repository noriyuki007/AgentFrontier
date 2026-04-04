const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();

const config = {
    user: "xs363809",
    password: "hr1gp1ho",
    host: "sv16830.xserver.jp",
    port: 21,
    localRoot: __dirname + "/out/",
    remoteRoot: "/agent-frontier.jp/public_html/staging/",
    include: ["*", "**/*"],
    exclude: [".DS_Store", "node_modules/**", ".next/**"],
    deleteRemote: false,
    forcePasv: true,
};

console.log("Starting FTP deployment to STAGING...");

ftpDeploy
    .deploy(config)
    .then((res) => {
        console.log("Deployment to STAGING finished successfully.");
        console.log("URL: https://agent-frontier.jp/staging/");
    })
    .catch((err) => console.error("Deployment error:", err));
