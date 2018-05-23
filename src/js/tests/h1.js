import puppeteer from "puppeteer";

export default async function h1(url) {
  const result = {};
  const browser = await puppeteer
    .launch({ headless: true })
    .catch(err => Error(err));
  const page = await browser.newPage().catch(err => Error(err));
  result.start = Date.now();
  await page.goto(url).catch(err => Error(err));
  result.finish = Date.now();
  result.content = await page
    .$eval(
      "#index-banner > div.no-pad-bot > div > div > h1",
      el => el.innerText
    )
    .catch(err => Error(err));
  await browser.close().catch(err => Error(err));
  return result;
}
