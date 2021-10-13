// document.querySelectorAll("figure .MorZF img.YVj9w")
const axios = require("axios");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");
const puppeteer = require("puppeteer");

const crwaler = async () => {
  try {
    // window.innerWidth, .innerHeight
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1440,796"] });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1440,
      height: 796,
    });
    // navigator.userAgent
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36");

    // * evalueate안에서 console.log찍기 위해 필요한 코드
    // prettier-ignore
    page.on('console', (log) => {
      if(log._type !== "warning"){
        console.log(log._text)
      }
    });
    await page.goto("https://unsplash.com/");

    let count = 1;
    do {
      const parsingResult = await page.evaluate(() => {
        // evalueate외부에서 정의된 상수 사용불가
        const result = [];
        // .MorZF 이 부분을 삭제, scrollby로 이벤트 -> reload -> parsing
        document.querySelectorAll("figure .MorZF img.YVj9w").forEach((element) => {
          result.push(element.currentSrc);
        });
        if (result) {
          return result;
        }
      });

      const imgPath = parsingResult.filter((value) => {
        return value && value;
      });
      const input = fs.readFileSync("src/coffee_assets/tmp/csv/test.txt").toString("utf-8");
      const inputText = imgPath.join("\n") + input;
      console.log(inputText);
      fs.writeFileSync("src/coffee_assets/tmp/csv/test.txt", inputText);

      await page.evaluate(() => {
        try {
          document.querySelectorAll("figure .MorZF").forEach((element) => {
            element.parentElement.remove();
          });
          window.scrollBy(0, 500);
        } catch (err) {
          console.log(err);
        }
      });

      await page.waitForTimeout(5000);
    } while (count >= 3 ? false : count++);

    await page.close();

    await browser.close();
  } catch (err) {
    console.log(err);
  }
};

crwaler();

fs.readFileSync("src/coffee_assets/tmp/");
