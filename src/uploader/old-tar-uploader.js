const puppeteer = require("puppeteer");

const crawler = async (provider) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1280,1280"],
    });
    browser.userAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
    );

    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 1280,
    });

    // * provider 검색
    await page.goto("http://115.22.68.60/master/uphtml_sub_all.jsp");
    await page.waitForSelector("select");
    await page.waitForTimeout(Math.floor(Math.random() * 1000));

    let check = true;
    while (check) {
      await page.type("select", provider);
      await page.waitForTimeout(Math.floor(Math.random() * 1000));

      await page.click("input[name=cc]");
      await page.waitForTimeout(Math.floor(Math.random() * 1000));

      await page.waitForSelector("select");
      await page.waitForTimeout(Math.floor(Math.random() * 1000));

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

      await page.waitForTimeout(5000);

      const partNumber = await page.evaluate(() => {
        return document.querySelector("tr td:nth-child(1) > a").textContent;
      });

      const FilePath = __dirname.split("crawler-intro")[0] + "tar";

      if (partNumber) {
        const text = `${FilePath}\\${partNumber}.tgz`;
        const input = await page.$("input[type=file]");
        await input.uploadFile(text);
        await page.waitForTimeout(1000);

        await page.keyboard.down("Control");
        await page.waitForTimeout(1000);

        await page.click("input[name=B1]");
        await page.waitForTimeout(1000);
        await page.keyboard.up("Control");
        await page.waitForTimeout(Math.floor(Math.random() * 5000 + 5000));
      } else {
        check = false;
      }
    }
  } catch (err) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@     ERROR     @@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(err);
  }
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log("@@@@@@@@@@@@@@@@@@ TAR UPLOAD DONE @@@@@@@@@@@@@@@@@@");
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
};

// 검색할 내용을 입력하세요

const siteNames = "Schneider";

crawler(siteNames);
