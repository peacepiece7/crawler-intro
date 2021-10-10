const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");
const puppeteer = require("puppeteer");

const text = fs.readFileSync("src/assets/csv/gsc.csv").toString("utf-8");
const records = parse(text);

// * puppeteer로 GSC 사이트에 접속 - parsing - 파싱한 데이터를 csv로 저장
// * for of로 순차 접근
const crwaler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // navigator.userAgent
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36");

    const result = [];
    for (const [i, r] of Object.entries(records)) {
      try {
        await page.goto(r[2]);
        await page.waitForTimeout(2000);

        const parsingResult = await page.evaluate(() => {
          const name = [...document.querySelectorAll(".item_name")].map((element) => {
            return element.textContent;
          });
          return name;
        });
        for (let i = 0; i < parsingResult.length; i++) {
          // * push 양식 중요! 배열안에 문자열을 넣거나, 문자열을 push하면 에러나거나 배열이 이상해짐..!
          result.push([r[0], r[1], r[2], parsingResult[i]]);
        }
        console.log(result);
        const str = stringify(result);
        fs.writeFileSync("src/assets/csv/gsc_result.csv", str);
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
