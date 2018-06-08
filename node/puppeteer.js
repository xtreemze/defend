const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer
    .launch({
      headless: false,
      timeout: 2000
    })
    .catch(err => Error(err));

  const page = await browser.newPage().catch(err => Error(err));

  await page.setViewport({ width: 512, height: 512 }).catch(err => Error(err));

  await page
    .goto("http://localhost:8080/", {
      waitUntil: "networkidle2",
      timeout: 5000
    })
    .catch(err => Error(err));

  await setTimeout(async () => {
    await page
      .screenshot({
        path: "./release/screenshot.png"
      })
      .catch(err => Error(err));
    await setTimeout(async () => {
      await page
        .screenshot({
          path: "./release/screenshot2.png"
        })
        .catch(err => Error(err));
      await setTimeout(async () => {
        await page
          .screenshot({
            path: "./release/screenshot3.png"
          })
          .catch(err => Error(err));
        await browser.close();
      }, 300);
    }, 300);
  }, 6200);
})();
