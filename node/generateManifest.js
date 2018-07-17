const fsExtra = require("fs-extra");

const version = process.env.npm_package_version;

const content = `{
  "name": "Defend",
  "short_name": "Defend",
  "start_url": "https://xtreemze.github.io/defend/",
  "display": "fullscreen",
  "version": "${version}",
  "lang" : "en_US",
  "description" : "Procedural Cross-Platform 3D Tower Defense WebGame with Physics and AI and Procedural Sound",
  "orientation" : "undefined"
}
`;

fsExtra.writeFile("./src/site.webmanifest", content, "utf-8", err => {
  Error(err);
});

fsExtra.writeFile("./dist/site.webmanifest", content, "utf-8", err => {
  Error(err);
});
