const axios = require("axios");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");
const puppeteer = require("puppeteer");

fs.readdir("src/assets/tmp/screenshot", (err) => {
  if (err) {
    console.error("screenshot 폴더가 없어 screentshot 폴더를 생성합니다.");
    fs.mkdirSync("src/assets/tmp/screenshot");
  }
});

fs.readdir("src/assets/tmp/poster", (err) => {
  if (err) {
    console.error("poster 폴더가 없어 poster 폴더를 생성합니다.");
    fs.mkdirSync("src/assets/tmp/poster");
  }
});

const text = fs.readFileSync("src/assets/csv/movie_data.csv").toString("utf-8");
const records = parse(text);

const crwaler = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const result = [];
  try {
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await browser.newPage();
          // navigator.userAgent
          await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
          );
          await page.goto(r[1]);

          const parsingResult = await page.evaluate(() => {
            const score = document.querySelector(".score.score_left .star_score");
            if (score) {
              return score.textContent;
            }
          });
          result.push([r[0], r[1], parsingResult.trim()]);
          console.log(result);
          const str = stringify(result);
          fs.writeFileSync("src/assets/tmp/movie_result.csv", str);
          await page.waitForTimeout(2000);
          await page.close();
        } catch (e) {
          console.error(e);
        }
      }),
    );

    await browser.close();
  } catch (e) {
    console.log(e);
  }
};

crwaler();
