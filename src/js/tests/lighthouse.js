const chromeLauncher = require("chrome-launcher");
const puppeteer = require("puppeteer");
const lighthouse = require("lighthouse");
const request = require("request");
const util = require("util");
const perfConfig = require("./fastLhConfig.json");

export default async function lh(url) {
  const opts = {
    chromeFlags: ["--headless"],
    logLevel: "silent",
    output: "json"
  };

  // Launch chrome using chrome-launcher.
  const chrome = await chromeLauncher.launch(opts);
  opts.port = chrome.port;

  // Connect to it using puppeteer.connect().
  const resp = await util.promisify(request)(
    `http://localhost:${opts.port}/json/version`
  );
  const { webSocketDebuggerUrl } = JSON.parse(resp.body);
  const browser = await puppeteer.connect({
    browserWSEndpoint: webSocketDebuggerUrl
  });

  // Run Lighthouse.
  const lhr = await lighthouse(url, opts, perfConfig);

  await browser.disconnect();
  await chrome.kill();
  return lhr;
}
