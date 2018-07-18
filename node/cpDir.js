const fsExtra = require("fs-extra");

const version = process.env.npm_package_version;

fsExtra.copy("./src/.htaccess", "./dist/.htaccess", err => {
  Error(err);
});

fsExtra.copy("./src/sw2.js", "./dist/sw2.js", err => {
  Error(err);
});
