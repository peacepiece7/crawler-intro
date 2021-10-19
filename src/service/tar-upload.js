const puppeteer = require("puppeteer");

const crawler = async (provider) => {
  try {
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1280,1280"] });
    browser.userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36");

    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 1280,
    });

    // * provider 검색
    await page.goto("http://115.22.68.60/master/uphtml_sub_all.jsp");
    await page.waitForSelector("select");
    await page.waitForTimeout(888);

    let bool = true;
    while (bool) {
      await page.type("select", provider);
      await page.waitForTimeout(2000);
      await page.click("input[name=cc]");

      await page.waitForSelector("select");
      await page.waitForTimeout(1244);

      // * Detail Icon Click
      await page.evaluate(() => {
        const icons = document.querySelectorAll("tr td:nth-child(5) a");
        icons &&
          Array.from(icons).forEach((icon, idx) => {
            if (idx >= 2) {
              icon.click();
            }
          });
      });

      await page.waitForTimeout(2000);

      const partNumber = await page.evaluate(() => {
        return document.querySelector("tr td:nth-child(1) > a").textContent;
      });

      if (partNumber) {
        const text = `C:\\Users\\INTERBIRD\\Desktop\\tar\\${partNumber}.tgz`;
        const input = await page.$("input[type=file]");
        await input.uploadFile(text);
        await page.keyboard.down("Control");
        await page.click("input[name=B1]");
        await page.keyboard.up("Control");
      } else {
        bool = false;
      }
    }
  } catch (err) {
    console.log(err);
  }
};

crawler("weidmuller");
