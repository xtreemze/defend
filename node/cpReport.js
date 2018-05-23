const fsExtra = require("fs-extra");

const version = process.env.npm_package_version;

fsExtra.copy(
  "./release/lighthouse.html",
  "./dist/release/lighthouse.html",
  err => {
    Error(err);
  }
);
