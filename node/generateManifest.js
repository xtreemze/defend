const fsExtra = require("fs-extra");

const version = process.env.npm_package_version;

const content = `{
  "name": "Defend",
  "short_name": "Defend",
  "start_url": "https://xtreemze.github.io/defend/",
  "display": "fullscreen",
  "version": "${version}",
  "lang": "en_US",
  "description":
    "In “Defend” you’re placed in the center of a stronghold contained within a 3D world. You will be immediately faced with a constant onslaught of attacks from aggressive spherical objects who seek to destroy your energy reserves as this is the only source of life in this world. Repel the attacks and maintain your stronghold with a sustainable level of resources.",
  "orientation": "any",
  "icons": [
    {
      "src": "android-chrome-36x36.png",
      "sizes": "36x36",
      "type": "image/png"
    },
    {
      "src": "android-chrome-48x48.png",
      "sizes": "48x48",
      "type": "image/png"
    },
    {
      "src": "android-chrome-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "android-chrome-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "android-chrome-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "android-chrome-256x256.png",
      "sizes": "256x256",
      "type": "image/png"
    },
    {
      "src": "android-chrome-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#160230",
  "background_color": "#160230",
  "developer": {
    "name": "Carlos Velasco @xtreemze",
    "url": "https://github.com/xtreemze/"
  },
  "default_locale": "en",
  "chrome": { "navigation": true }
}
`;

fsExtra.writeFile("./src/site.webmanifest", content, "utf-8", err => {
	Error(err);
});

fsExtra.writeFile("./dist/site.webmanifest", content, "utf-8", err => {
	Error(err);
});
