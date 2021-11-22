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
    const page = await browser.newPage();
    await page.setViewport({ width: 1420, height: 1420 });
    const baseUrl = "https://www.wago.com/global/c/system-wiring";
    let isExist = true;
    let count = 3;
    while (isExist) {
      await page.goto(`${baseUrl}?page=${count}`);
      await page.waitForNetworkIdle({ idleTime: 2000 });
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
        console.log("다운로드 링크 개수 : ", downloadLinks.length);
        for (let i = 0; i < downloadLinks.length; i++) {
          const page = await browser.newPage();
          await page.goto(downloadLinks[i]);
          await page.waitForNetworkIdle({ idleTime: 2000 });
          const popup = await page.$(".wg-button-bar--align-right button:last-child");
          popup && (await page.click(".wg-button-bar--align-right button:last-child"));
          await page.waitForTimeout(2000);
          await page.evaluate(() => {
            const downloadLink = document.querySelector(".js-datasheet-download.wg-product-actionbtn");
            downloadLink.click();
          });
          await page.waitForSelector(".wg-modal__content .wg-modal__footer .wg-button--primary");
          await page.waitForTimeout(Math.floor(Math.random(2000)) + 10000);
          await page.click(".wg-modal__content .wg-modal__footer .wg-button--primary");
          await page.waitForNetworkIdle({ idleTime: 1000 });
          await page.close();
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
};

crawler();
