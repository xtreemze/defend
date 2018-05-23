import test from "tape";
import tapSpec from "tap-spec";
import lh from "./lighthouse";

test
  .createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

const host = `https://lequinox.lequa-test.com/dev`;
// const host = `http://localhost:8080`;

const titles = [
  ["p1", "CYBER-RESILIENCE ON-THE-GO FOR THE PROGRAMMABLE ENTERPRISE"],
  ["p2", "ALL IN ONE TRUST SERVICE PLATFORM"],
  ["p3", "PLUG AND PLAY TRUST SERVICES PLATFORM"],
  ["p4", "SECURITY AND COMPLIANCE FOR EVERYDAY BUSINESS"],
  ["p5", "A PLUS TO YOUR EVERYDAY TASKS"],
  ["p6", "A PLUS TO INDUSTRY DIGITAL PROCESSES"],
  ["p7", "EMPOWERING THE DIGITALLY TRANSFORMED ENTERPRISE"],
  ["p8", "GEAR UP PROCESS PERFORMANCE"],
  ["p9", "GEAR UP IT PERFORMANCE"],
  ["p10", "GEAR UP COMPLIANCE AUTOMATION"],
  ["portal", "CUSTOMER PORTAL"]
];

titles.forEach(element => {
  const pageNumber = element[0];
  const url = `${host}/?${pageNumber}`;

  test(url, async t => {
    const lhr = await lh(url);

    await t.ok(
      (await lhr.audits["bootup-time"].rawValue) < 1000,
      `JSBootParse: ${await parseInt(lhr.audits["bootup-time"].rawValue, 10)}ms`
    );

    await t.ok(
      (await lhr.audits["first-meaningful-paint"].rawValue) < 2000,
      `First Paint: ${await parseInt(
        lhr.audits["first-meaningful-paint"].rawValue,
        10
      )}ms`
    );

    await t.ok(
      (await lhr.audits["first-interactive"].rawValue) < 30000,
      `First Inter: ${await parseInt(
        lhr.audits["first-interactive"].rawValue,
        10
      )}ms`
    );

    await t.ok(
      (await lhr.score) > 40,
      `Lighthouse%: ${await parseInt(lhr.score, 10)}`
    );

    await t.end();
  });
});
