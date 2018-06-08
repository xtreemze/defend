const fsExtra = require("fs-extra");

const version = process.env.npm_package_version;

const content = `{
  "name": "Defend",
  "short_name": "Defend",
  "start_url": "./",
  "display": "standalone",
  "version": "${version}"
}
`;

fsExtra.writeFile("./src/site.webmanifest", content, "utf-8", err => {
  Error(err);
});

fsExtra.writeFile("./dist/site.webmanifest", content, "utf-8", err => {
  Error(err);
});
