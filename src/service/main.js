const fs = require("fs");
const puppeteer = require("puppeteer");
const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");
const axios = require("axios").default;
import { Readable } from "stream";

fs.readdir("src/coffee_assets/tmp/csv", (err) => {
  console.log("exist");
  if (err) {
    console.error(err);
    console.log("디렉터리가 생성 되었습니다.");
    fs.mkdirSync("src/coffee_assets/tmp/csv");
  }
});
fs.readdir("src/coffee_assets/tmp/image", (err) => {
  console.log("exist");
  if (err) {
    123;
    console.error(err);
    console.log("디렉터리가 생성 되었습니다.");
    fs.mkdirSync("src/coffee_assets/tmp/image");
  }
});
fs.readdir("src/coffee_assets/tmp/screenshot", (err) => {
  console.log("exist");
  if (err) {
    console.error(err);
    console.log("디렉터리가 생성 되었습니다.");
    fs.mkdirSync("src/coffee_assets/tmp/screenshot");
  }
});

const input = fs.readFileSync("src/coffee_assets/tmp/csv/gsc_path.csv").toString("utf-8");
const csvFile = parse(input);

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    browser.userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36");

    for (const [i, r] of Object.entries(csvFile)) {
      const page = await browser.newPage();
      await page.goto(r[1]);
      const parseResult = await page.evaluate(() => {
        const result = [];
        // parse anchor tag
        const anchorEl = document.querySelectorAll(".item_photo_box a");
        const links = [...anchorEl].map((element) => {
          return element.href;
        });

        // parse name tag
        const names = [...document.querySelectorAll(".item_tit_box .item_name")].map((element) => {
          return element.textContent;
        });

        // parse price tag
        const prices = [...document.querySelectorAll(".item_money_box .item_price span")].map((element) => {
          return element.textContent;
        });

        const imgPath = [...document.querySelectorAll(".item_cont .item_photo_box a img")].map((element) => {
          return element.currentSrc;
        });

        for (let i = 0; i < links.length; i++) {
          result.push([links[i], names[i], prices[i].replace(",", "")]);
        }
        return { result, imgPath };
      });

      parseResult.imgPath.map(async (val, idx) => {
        try {
          console.log(val);
          // "stream"이 response를 반환하지 않는다면, "arrayBuffer"를 사용
          const response = await axios({
            url: val,
            method: "GET",
            responseType: "stream",
          });
          const w = response.data.pipe(fs.createWriteStream(`src/coffee_assets/tmp/image/${parseResult.result[idx][1]}.jpg`));
          w.on("finish", () => {
            console.log("Successfully downloaded file!");
          });

          // fs.writeFileSync(`src/coffee_assets/tmp/image/${parseResult.result[idx][1]}.jpg`, image.data);
        } catch (err) {
          console.log(err);
        }
      });

      const str = stringify(parseResult.result);
      fs.writeFileSync("src/coffee_assets/tmp/parse_result/gsc_result.csv", str);

      await page.waitForTimeout(3000);
      await page.close();
    }
    await browser.close();
  } catch (err) {
    console.log(err);
  }
};

crawler();
