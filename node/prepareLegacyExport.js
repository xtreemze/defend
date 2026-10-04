const path = require("path");
const fsExtra = require("fs-extra");

const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

fsExtra.removeSync(dist);
fsExtra.ensureDirSync(dist);
fsExtra.copySync(path.join(root, "src", ".htaccess"), path.join(dist, ".htaccess"));
fsExtra.copySync(path.join(root, "src", "sw2.js"), path.join(dist, "sw2.js"));
