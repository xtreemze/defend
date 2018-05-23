const fsExtra = require("fs-extra");

const version = process.env.npm_package_version;

fsExtra.copy("./src/.htaccess", "./dist/.htaccess", err => {
  Error(err);
});
