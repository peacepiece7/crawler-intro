const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const dir = path.join(__dirname, "..", "..", "..", "molexPdfs");

const crawler = async (input) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-notifications"],
      defaultViewport: { width: 1780, height: 1780 },
    });
    await browser.userAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36"
    );
    console.log("Browser launched");
    const baseUrl = input[0];
    let isExist = true;
    let offsetNumber = input[1] ? input[1] : 0;
    while (isExist) {
      let page = await browser.newPage();
      await page.setViewport({ width: 1420, height: 1420 });
      await page.goto(`${baseUrl}&offset=${offsetNumber}`);
      await page.waitForTimeout(5000);
      const contents = await page.evaluate(() => {
        const content = document.querySelectorAll(".part-desc h3 a");
        if (content.length >= 1) {
          return true;
        } else {
          return false;
        }
      });

      if (contents) {
        console.log(`Current offset : ${offsetNumber}`);
        await page.waitForTimeout(1000);
        const downloadLinks = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll(".part-desc h3 a")).map((v) => v.href);
          return links;
        });

        console.log(`Found ${downloadLinks.length} links, start downloading`);
        for (let i = 0; i < downloadLinks.length; i++) {
          page = await browser.newPage();
          await page.goto(downloadLinks[i]);
          await page.waitForTimeout(2000);
          const pdfLink = await page.evaluate(() => {
            const link = document.querySelector(".noline").href;
            return link;
          });
          const pdfName = await page.evaluate(() => {
            const name = document.querySelector(".part-number h1").textContent.split(":")[1];
            return name;
          });
          if (!pdfLink || !pdfName) {
            console.log("--------------------------------------------------------------------------------");
            console.log("PDF 링크가 존재하지 않거나 Part number를 찾을 수 없습니다. 다운이 끝난 뒤 확인해주세요");
            console.log(downloadLinks[i]);
            console.log("--------------------------------------------------------------------------------");
          } else {
            axios({
              method: "get",
              url: pdfLink,
              responseType: "arraybuffer",
            })
              .then((res) => {
                fs.readFile(`${dir}/${pdfName}.pdf`, (err, data) => {
                  if (err) {
                    fs.writeFileSync(`${dir}/${pdfName}.pdf`, res.data);
                  }
                  if (data) {
                    console.log(`${pdfName}.pdf is existed`);
                  }
                });
              })
              .catch(() => {
                console.log("Failure, Unable to load pdf file path");
                console.log("태욱이를 부르세요");
              });
          }
          page.close();
        }
        offsetNumber += 20;
      } else {
        isExist = false;
      }
      await page.waitForTimeout(Math.floor(Math.random() * 2000));
    }
  } catch (err) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@     ERROR     @@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(err);
  }
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log("@@@@@@@@@@@@@@@@@@@@ DOWNLOAD DONE @@@@@@@@@@@@@@@@@@@@");
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function inputPath() {
  fs.readdir(dir, (err) => {
    if (err) {
      fs.mkdirSync(dir);
    }
  });
  let input;
  console.log("주소를 입력하세요 (초기 offset은 한 칸 띄우고 20단위로 작성)");
  rl.on("line", (line) => {
    input = line;
    rl.close();
  }).on("close", () => {
    input = input.split(" ");
    crawler(input);
  });
}

inputPath();

// https://www.molex.com/molex/search/deepSearch?pQuery=category%253A%2522Antennas%2522%2540type%253A*Wi-Fi*
// https://www.molex.com/molex/search/deepSearch?pQuery=category%253A%2522Antennas%2522%2540type%253A%2522Cellular%2BAntenna%2522
// https://www.molex.com/molex/search/deepSearch?pQuery=type%253A%2522LPWAN%2522
// https://www.molex.com/molex/search/deepSearch?pQuery=category%253A%2522Antennas%2522%2540type%253A%2528%2522GNSS%2BAntenna%2522%2BOR%2B%2522GPS%2BAntenna%2522%2529
// https://www.molex.com/molex/search/deepSearch?pQuery=application%253A%2522Wire-to-Board%2522
