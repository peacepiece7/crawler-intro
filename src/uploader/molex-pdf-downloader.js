// https://www.molex.com/molex/search/partSearchPage?isseriesPagination=yes&itemListRe=&itemList=&pQuery=q%253D*%253A*%2540fq%253Dcollection%253Aimpulse%2540fq%253Dcategory%253A%2522Antennas%2522%2540fq%253Dtype%253A*Wi-Fi*%2540fq%253D&offset=20&currentQuery=
// `https://www.molex.com/molex/search/partSearchPage?isseriesPagination=yes&itemListRe=&itemList=&pQuery=q%253D*%253A*%2540fq%253Dcollection%253Aimpulse%2540fq%253Dcategory%253A%2522Antennas%2522%2540fq%253Dtype%253A*Wi-Fi*%2540fq%253D&currentQuery=&offset=${offsetNumber}`

const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const { QueryHandler } = require("query-selector-shadow-dom/plugins/puppeteer");
const crawler = async () => {
  try {
    await puppeteer.__experimental_registerCustomQueryHandler("shadow", QueryHandler);
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-notifications"],
      defaultViewport: { width: 1780, height: 1780 },
    });
    await browser.userAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36"
    );

    const baseUrl =
      "https://www.molex.com/molex/search/deepSearch?pQuery=category%253A%2522Antennas%2522%2540type%253A*Wi-Fi*";
    let isExist = true;
    let offsetNumber = 0;
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
        await page.waitForTimeout(1000);
        const downloadLinks = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll(".part-desc h3 a")).map((v) => v.href);
          return links;
        });
        console.log("다운로드 링크 개수 : ", downloadLinks.length);
        for (let i = 0; i < downloadLinks.length; i++) {
          page = await browser.newPage();
          await page.goto(downloadLinks[i]);
          await page.waitForNetworkIdle({ idleTime: 2000 });
          const popup = await page.$(".wg-button-bar--align-right button:last-child");
          popup && (await page.click(".wg-button-bar--align-right button:last-child"));
          await page.waitForTimeout(2000);
          const downloadLink = await page.evaluate(() => {
            return document.querySelector(".noline").href;
          });
          console.log("DOWNLOAD LINK :", downloadLink);
          await page.waitForTimeout(Math.floor(Math.random(2000)) + 5000);

          await page.goto(downloadLink);

          await page.waitForNetworkIdle({ idleTime: 1000 });
          await page.waitForNetworkIdle({ idleTime: 1000 });
          page.close();
        }
        console.log(`${count}page is done`);
        count += 1;
      } else {
        isExist = false;
      }
    }
  } catch (err) {
    console.log("@@@@ error @@@@");
    console.log(err);
  }
  console.log("@@@@@@@@@@@@@@@@@@@@ DOWNLOAD DONE @@@@@@@@@@@@@@@@@@@@");
};

crawler();
