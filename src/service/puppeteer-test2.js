const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const puppeteer = require("puppeteer");

const text = fs.readFileSync("src/assets/csv/gsc.csv").toString("utf-8");
const records = parse(text);

const crwaler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36");

    for (const [i, r] of Object.entries(records)) {
      try {
        await page.goto(r[2]);
        await page.waitForTimeout(2000);

        const result = await page.evaluate(() => {
          const name = [...document.querySelectorAll(".item_name")].map((element) => {
            return element.textContent;
          });
          return name;
        });
        console.log(result);
      } catch (e) {
        console.log(e);
      }
    }

    await page.close();
    await browser.close();
  } catch (e) {
    console.log(e);
  }
};

crwaler();
