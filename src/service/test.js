const puppeteer = require("puppeteer");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");
const { installMouseHelper } = require("./install-mouse-helper");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size:1280,1280"],
      defaultViewport: { width: 900, height: 1080 },
    });
    await browser.userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36");

    // 모든 사이트 돌아다니면서 파싱 시작
    const input = fs.readFileSync("src/coffee_assets/tmp/parse_location/gsc_parse_location.csv").toString("utf-8");
    const records = parse(input);
    const page = await browser.newPage();

    await installMouseHelper(page);
    const result = [];
    for (const [i, r] of Object.entries(records)) {
      await page.goto(r[1]);
      const parseResult = await page.evaluate(() => {
        const result = [];
        //? if sold out
        // const soldOutEl = document.querySelectorAll(".item_photo_box .item_soldout_bg")

        // parse thumnail
        //? forEach사용해보기
        const titles = [...document.querySelectorAll(".item_tit_box .item_name")].map((element) => {
          return element.textContent;
        });

        const countries = titles.map((val) => {
          const country = val.replace(/].+/, "").split("[").join("");
          return country;
        });

        const directUrl = [...document.querySelectorAll(".item_cont .item_photo_box a")].map((value) => value.href);

        // parse price
        const prices = [...document.querySelectorAll(".item_money_box .item_price span")].map((element) => {
          return element.textContent;
        });
        for (let i = 0; i < titles.length; i++) {
          result.push([titles[i], countries[i], prices[i].replace(",", "").trim(), directUrl[i]]);
        }
        return result;
      });
      parseResult[0] &&
        parseResult.map((value) => {
          result.push(value);
        });
    }
    const csvFile = stringify(result);
    fs.writeFileSync("src/coffee_assets/tmp/parse_result/gsc_result.csv", csvFile);
  } catch (er) {
    console.log(er);
  }
};

crawler();
