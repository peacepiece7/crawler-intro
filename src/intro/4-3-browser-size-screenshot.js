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
  // window.innerWidth, .innerHeight
  const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1440,796"] });
  const result = [];
  try {
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await browser.newPage();
          await page.setViewport({
            width: 1440,
            height: 796,
          });
          // navigator.userAgent
          await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
          );
          await page.goto(r[1]);

          const parsingResult = await page.evaluate(() => {
            const scoreEl = document.querySelector(".score.score_left .star_score");
            const imgEl = document.querySelector(".poster img");
            let score = "";
            if (scoreEl) {
              score = scoreEl.textContent;
            }
            let imgPath = "";
            if (imgEl) {
              imgPath = imgEl.src;
            }
            return { score, imgPath };
          });

          if (parsingResult.score) {
            result.push([r[0], r[1], parsingResult.score.trim()]);
            const str = stringify(result);
            fs.writeFile("src/assets/tmp/movie_result.csv", str, (err) => {
              if (err) throw err;
              console.log("csv file has been saved");
            });
          }

          if (parsingResult.imgPath) {
            // puppeteer는 jpg, png를 지원함
            // clip이랑 tag의 좌표를 구해서 특정 범위만큼(캡쳐, 다운이 불가능한)을 캡쳐할 수 있음

            // * page.screenshot
            await page.screenshot({
              path: `src/assets/tmp/screenshot/${r[0]}capture.jpg`,
              // fullPage: true,
              clip: {
                x: 100,
                y: 100,
                width: 300,
                height: 300,
              },
            });

            // * fs.writeFile || fs.writeFileSync
            const buffer = await page.screenshot();
            fs.writeFile(`src/assets/tmp/screenshot/${r[0]}.jpg`, buffer, (err) => {
              if (err) throw err;
              console.log("the image file has been saved");
            });

            const imgResult = await axios.get(parsingResult.imgPath.replace(/\?.*$/g, ""), {
              responseType: "arraybuffer",
            });
            fs.writeFileSync(`src/assets/tmp/poster/${r[0]}.jpg`, imgResult.data);
          }

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
