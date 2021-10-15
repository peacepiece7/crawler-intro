const puppeteer = require("puppeteer");
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");

// Create GSC_path.csv
fs.readdir("src/coffee_assets/tmpdefault_/location/gsc_parse_location.csv", (err) => {
  if (!err) {
    fs.mkdirSync("src/coffee_assets/tmp/default_location/gsc_parse_location.csv");
  }
});

fs.readdir("src/coffee_assets/tmp/parse_location/gsc_location.csv", (err) => {
  if (!err) {
    fs.mkdirSync("src/coffee_assets/tmp/parse_location/gsc_location.csv");
  }
});

let input = fs.readFileSync("src/coffee_assets/tmp/default_location/gsc_location.csv").toString("utf-8");
let records = parse(input);

const crawler = async () => {
  try {
    // * parse proxy list
    // let browser = await puppeteer.launch({ headless: false, args: ["--window-size=1280,1080"], defaultViewport: { width: 900, height: 1080 } });
    // await browser.userAgent(
    //   "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    // );
    // let page = await browser.newPage();
    // await page.goto("https://spys.one/en/free-proxy-list/");

    // const proxies = await page.evaluate(() => {
    //   const ips = [...document.querySelectorAll(".spy14:first-child .spy2")].map((element) => {
    //     return element.parentNode.textContent.replace(/document\.write\(.+\)/, "");
    //   });
    //   const types = [...document.querySelectorAll("tr td:nth-of-type(2)")]
    //     .filter((v, i) => {
    //       if (i > 2) {
    //         return v;
    //       }
    //     })
    //     .map((v) => {
    //       return v.textContent;
    //     });
    //   const latencies = Array.from(document.querySelectorAll("tr td:nth-of-type(6) .spy1")).map((element) => {
    //     return element.textContent;
    //   });

    //   return ips.map((value, idx) => {
    //     return {
    //       ip: value,
    //       type: types[idx],
    //       latency: latencies[idx],
    //     };
    //   });
    // });
    // const filtered = proxies.filter((value) => value.type.split(" ")[0] === "HTTPS").sort((pre, cur) => pre.latency - cur.latency);
    // await page.close();
    // await browser.close();

    // await page.waitForTimeout(2000);

    // console.log(filtered[0].ip);

    // * GSC site parsing
    // gsc path를 가져옴
    // gsc,https://www.gsc.coffee/goods/goods_list.php?page=2&cateCd=001
    // { ip: '188.166.242.197:3128', type: 'HTTP', latency: '0.737' },
    // 176.74.150.34:8080
    // 198.144.149.82:3128
    // 185.239.105.211:3128
    // `--proxy-server=176.74.150.34:8080`

    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size:1280,1280"],
      defaultViewport: { width: 900, height: 1080 },
    });
    await browser.userAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    );
    const newLocationList = [];
    const page = await browser.newPage();
    for (const [i, r] of Object.entries(records)) {
      let originLocation = r[1];
      await page.goto(originLocation);
      await page.waitForSelector(".pagination ul");
      let pageIdx = 1;
      let check = true;
      do {
        check = await page.evaluate(() => {
          const contEls = document.querySelectorAll(".item_cont");
          if (contEls.length) {
            return true;
          } else {
            return false;
          }
        });

        pageIdx++;
        // 이 부분은 regex로 변경해야 crawler("site name")로 모든 사이트 동작 가능
        const pageLocation = originLocation.replace("php?", `php?page=${pageIdx}&`);
        await page.goto(pageLocation);
        check && newLocationList.push(["gsc", pageLocation]);
      } while (check);
    }
    records.map((val) => {
      newLocationList.push(val);
    });

    const csvFomat = stringify(newLocationList);
    fs.writeFileSync("src/coffee_assets/tmp/parse_location/gsc_parse_location.csv", csvFomat);
    await page.close();

    // 모든 사이트 돌아다니면서 파싱 시작
    input = fs.readFileSync("src/coffee_assets/tmp/parse_location/gsc_parse_location.csv");
    records = parse(input);

    await page.waitForTimeout(3000);
    await page.newPage();
    for (const [i, r] of records.entries()) {
      await page.goto(r[1]);
      const parseResult = await page.evaluate(() => {
        const result = [];

        //? if sold out
        // const soldOutEl = document.querySelectorAll(".item_photo_box .item_soldout_bg")

        // parse thumnail
        //? forEach사용해보기
        const names = [...document.querySelectorAll(".item_tit_box .item_name")].map((element) => {
          return element.textContent;
        });

        // parse price
        const prices = [...document.querySelectorAll(".item_money_box .item_price span")].map((element) => {
          return element.textContent;
        });
        for (let i = 0; i < links.length; i++) {
          result.push([links[i], names[i], prices[i].replace(",", "")]);
        }
        return { result };
      });
    }
  } catch (err) {
    console.log(err);
  }
};

crawler();

// SOCKS5 = Deep web browser header
// HIA = High Annonimity
// NOA = Not of Annonimity

// https://spys.one/en/free-proxy-list/
// postman으로 보냈을 떄, 페이지 정보가 잘 나오면 크롤링하기 쉬운 사이트
