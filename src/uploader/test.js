// https://www.molex.com/molex/search/partSearchPage?isseriesPagination=yes&itemListRe=&itemList=&pQuery=q%253D*%253A*%2540fq%253Dcollection%253Aimpulse%2540fq%253Dcategory%253A%2522Antennas%2522%2540fq%253Dtype%253A*Wi-Fi*%2540fq%253D&offset=20&currentQuery=
// `https://www.molex.com/molex/search/partSearchPage?isseriesPagination=yes&itemListRe=&itemList=&pQuery=q%253D*%253A*%2540fq%253Dcollection%253Aimpulse%2540fq%253Dcategory%253A%2522Antennas%2522%2540fq%253Dtype%253A*Wi-Fi*%2540fq%253D&currentQuery=&offset=${offsetNumber}`

// https://www.molex.com/webdocs/datasheets/pdf/en-us/0731160000_CABLE_ASSEMBLIES.pdf
const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const { QueryHandler } = require("query-selector-shadow-dom/plugins/puppeteer");

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--disable-notifications"],
      defaultViewport: { width: 1780, height: 1780 },
    });
    await browser.userAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36"
    );

    let isExist = true;
    while (isExist) {
      let page = await browser.newPage();
      await page.setViewport({ width: 1420, height: 1420 });
      await page.goto("https://www.molex.com/webdocs/datasheets/pdf/en-us/0731160000_CABLE_ASSEMBLIES.pdf");
    }
  } catch (err) {
    console.log("@@@@ error @@@@");
    console.log(err);
  }
  console.log("@@@@@@@@@@@@@@@@@@@@ DOWNLOAD DONE @@@@@@@@@@@@@@@@@@@@");
};

crawler();
