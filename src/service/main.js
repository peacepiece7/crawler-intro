const fs = require("fs");
const puppeteer = require("puppeteer");
const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify");

fs.readdir("/src/coffee_assets/tmp/csv", (err) => {
  if (err) {
    console.error(err);
    console.log("디렉터리가 생성 되었습니다.");
    fs.mkdirSync("/src/coffee_assets/tmp/csv");
  }
});
fs.readdir("/src/coffee_assets/tmp/image", (err) => {
  if (err) {
    console.error(err);
    console.log("디렉터리가 생성 되었습니다.");
    fs.mkdirSync("/src/coffee_assets/tmp/image");
  }
});
fs.readdir("/src/coffee_assets/tmp/screenshot", (err) => {
  if (err) {
    console.error(err);
    console.log("디렉터리가 생성 되었습니다.");
    fs.mkdirSync("/src/coffee_assets/tmp/screenshot");
  }
});

const input = fs.readFileSync("/src/coffee_assets/tmp/csv/test.txt").toString("utf-8");
const csvFile = parse(input);

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    await browser.userAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    );
    for (const [i, r] of Object.entries(csvFile)) {
      const page = await browser.newPage();
      const url = r[1];
      page.goto(url);
      page.waitForTimeout(2000);
      page.close();
    }
    browser.close();
  } catch (err) {
    console.log(err);
  }
};

crawler();
