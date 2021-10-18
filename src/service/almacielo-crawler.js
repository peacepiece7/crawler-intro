const puppeteer = require("puppeteer");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");

// Create GSC_path.csv

const crawler = async (siteName) => {
  // default_location file에 ${sileNmae}_location.csv 파일을 만들고, 기본 주소를 입력해주세요!
  fs.readFile(`src/coffee_assets/tmp/parse_location/${siteName}_location.csv`, (err) => {
    if (err) {
      fs.writeFileSync(`src/coffee_assets/tmp/parse_location/${siteName}_location.csv`, "");
    }
  });

  fs.readFile(`src/coffee_assets/tmp/parse_result/${siteName}_parse_result.csv`, (err) => {
    if (err) {
      fs.writeFileSync(`src/coffee_assets/tmp/parse_result/${siteName}_parse_result.csv`, "");
    }
  });

  let input = fs.readFileSync(`src/coffee_assets/tmp/default_location/${siteName}_location.csv`).toString("utf-8");
  let records = parse(input);
  try {
    let browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size:1280,1280"],
      defaultViewport: { width: 900, height: 1080 },
    });
    await browser.userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36");
    const newUrlList = [];
    let page = await browser.newPage();
    for (const [i, r] of Object.entries(records)) {
      await page.goto(r[1]);
      let pageIdx = 1;
      let check = true;
      do {
        await page.waitForSelector(".pagination ul");
        await page.waitForTimeout(500);
        check = await page.evaluate(() => {
          const contEl = document.querySelectorAll(".item_cont .item_photo_box");
          if (contEl.length) {
            return true;
          } else {
            return false;
          }
        });

        pageIdx++;
        // 이 부분은 regex로 변경해야 crawler("site name")로 모든 사이트 동작 가능
        const pageLocation = r[1].replace("php?", `php?page=${pageIdx}&`);
        await page.goto(pageLocation);
        check && newUrlList.push(["gsc", pageLocation]);
      } while (check);
    }

    // 기존 default url을 새로 parsing한 url list에 추가
    records.map((val) => {
      newUrlList.push(val);
    });

    // newUrlList를 gsc_parse_location.csv에 저장
    let csvFormatData = stringify(newUrlList);
    fs.writeFileSync(`src/coffee_assets/tmp/parse_location/${siteName}_parse_location.csv`, csvFormatData);

    // 모든 사이트 돌아다니면서 파싱 시작
    input = fs.readFileSync("src/coffee_assets/tmp/parse_location/gsc_parse_location.csv").toString("utf-8");
    records = parse(input);
    page = await browser.newPage();
    const parsingResult = [];

    for (const [i, r] of Object.entries(records)) {
      await page.goto(r[1]);
      const evaluateResult = await page.evaluate(() => {
        const tagParsingResult = [];
        //? if sold out
        // const soldOutEl = document.querySelectorAll(".item_photo_box .item_soldout_bg")
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
          tagParsingResult.push([titles[i], countries[i], prices[i].replace(",", "").trim(), directUrl[i]]);
        }
        return tagParsingResult;
      });
      evaluateResult[0] &&
        evaluateResult.map((value) => {
          parsingResult.push(value);
        });
    }
    csvFormatData = stringify(parsingResult);
    fs.writeFileSync("src/coffee_assets/tmp/parse_result/gsc_parse_result.csv", csvFormatData);

    await page.close();
    await browser.close();
  } catch (err) {
    console.log(err);
  }
};

crawler("almacielo");
