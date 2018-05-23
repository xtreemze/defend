import test from "tape";
import tapSpec from "tap-spec";
import h1 from "./h1";

test
  .createStream()
  .pipe(tapSpec())
  .pipe(process.stdout);

let host;
if (process.argv.indexOf("-directory") !== -1) {
  //does our flag exist?
  host = process.argv[process.argv.indexOf("-directory") + 1]; //grab the next item
}

// const host = ;
// const host = `https://lequinox.lequa-test.com/dev`;
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
  const headerTitle = element[1];
  const url = `${host}?${pageNumber}`;

  test(url, async t => {
    const result = await h1(url);

    result.totalLoad = (await result.finish) - (await result.start);

    await t.is(
      await result.content,
      headerTitle,
      `H1isCorrect: ${result.content === headerTitle}`
    );

    await t.ok(
      (await result.totalLoad) < 800,
      `Page Loaded: ${await result.totalLoad}ms`
    );
    await t.end();
  });
});
