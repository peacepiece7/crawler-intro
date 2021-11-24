const puppeteer = require("puppeteer");
//? this.page로 page를 공유할 수 있나?
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

    const baseUrl = "https://www.wago.com/global/c/rail-mount-terminal-blocks";
    let isExist = true;
    let count = 6;
    while (isExist) {
      let page = await browser.newPage();
      await page.setViewport({ width: 1420, height: 1420 });
      await page.goto(`${baseUrl}?page=${count}`);
      await page.waitForTimeout(5000);
      const contents = await page.evaluate(() => {
        const content = document.querySelectorAll(".wg-listitem-neo.wg-listitem-neo--compact.wg-listitem-neo--product");
        if (content.length >= 1) {
          return true;
        } else {
          return false;
        }
      });

      if (contents) {
        await page.waitForTimeout(1000);
        const downloadLinks = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll(".wg-listitem-neo__marginal-column-entry a")).map(
            (v) => v.href
          );
          return links;
        });
        console.log(`Found ${downloadLinks.length} links, start downloading`);
        for (let i = 0; i < downloadLinks.length; i++) {
          page = await browser.newPage();
          await page.goto(downloadLinks[i]);
          await page.waitForNetworkIdle({ idleTime: 2000 });
          const popup = await page.$(".wg-button-bar--align-right button:last-child");
          popup && (await page.click(".wg-button-bar--align-right button:last-child"));
          await page.waitForTimeout(2000);
          await page.evaluate(() => {
            const downloadLink = document.querySelector(".js-datasheet-download.wg-product-actionbtn");
            downloadLink.click();
          });
          await page.waitForTimeout(Math.floor(Math.random(2000)) + 5000);
          await page.click(".wg-modal__content .wg-modal__footer .wg-button--primary");
          await page.waitForNetworkIdle({ idleTime: 1000 });
          page.close();
        }
        console.log(`${count} page is done`);
        count += 1;
      } else {
        isExist = false;
      }
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

crawler();
