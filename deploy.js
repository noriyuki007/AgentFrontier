require("dotenv").config();
const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();

const config = {
    user: process.env.FTP_USER || "xs363809",
    password: process.env.FTP_PASSWORD || "hr1gp1ho",
    host: "sv16830.xserver.jp",
    port: 21,
    localRoot: __dirname + "/out/",
    remoteRoot: "/agent-frontier.jp/public_html/",
    include: ["*", "**/*"],
    exclude: [".DS_Store"],
    deleteRemote: false,
    forcePasv: true,
};

console.log("Starting FTP deployment...");

ftpDeploy
    .deploy(config)
    .then((res) => console.log("Deployment finished successfully."))
    .catch((err) => console.error("Deployment error:", err));
