const dotenv = require("dotenv");
dotenv.config();
const puppeteer = require("puppeteer");
const fs = require("fs");
// * 각 컴퓨터 마다 path 수정
const crawler = async (siteNames) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size:1400,1400"],
    });

    // * 각 컴퓨터 마다 navigator.userAgent 확인 후 수정
    await browser.userAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
    );

    let page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 1280,
    });

    // evalueate안에서 console.log찍기 위해 필요한 코드
    // prettier-ignore
    page.on('console', (log) => {
        if(log._type !== "warning"){
          console.log(log._text)
        }
      });

    // Login
    await page.goto("http://34.64.149.214/master/login.jsp");
    await page.waitForSelector("input[name=id]");

    // * env 문자열로 변경
    await page.type("input[name=id]", process.env.NEW_ALLDATASHEET_ID);
    await page.type("input[name=pwd]", process.env.new_ALLDATASHEET_PASSWORD);
    await page.waitForTimeout(1000);

    await page.click("input[type=submit]");
    await page.waitForTimeout(Math.floor(Math.random() * 3000 + 2000));

    // if (typeof siteNames === "string") {
    //   uploadTar(browser, siteNames);
    // }

    for (let i = 0; i < siteNames.length; i++) {
      const siteName = siteNames[i];
      const FilePath = __dirname.split("crawler-intro")[0] + "tar-test";
      let check = true;
      while (check) {
        page = await browser.newPage();
        await page.goto("http://34.64.149.214/master/uphtml_sub_all.jsp", { waitUntil: "networkidle0" });
        await page.waitForTimeout(1000);
        await page.type("input[name=sFactory]", siteName);
        await page.click("input[name=cc]");
        await page.waitForTimeout(1000);
        await page.waitForSelector("body > center table tbody tr:nth-child(2) td");
        await page.waitForTimeout(2000);

        const partNumber = await page.evaluate(() => {
          if (document.querySelector("body > center table tbody tr[align=center]:nth-child(2) td")) {
            return document.querySelector("body > center table tbody tr[align=center]:nth-child(2) td").textContent;
          }
          return null;
        });
        console.log("part number :", partNumber);

        if (partNumber) {
          const text = `${FilePath}\\${partNumber}.tgz`;
          const inputElement = await page.$("input[type=file]");
          await inputElement.uploadFile(text);
          await page.waitForTimeout(1000);
          await page.click("input[name=B1]");
          await page.waitForNetworkIdle();
          await page.waitForTimeout(Math.floor(Math.random() * 1000 + 5000));
          console.log("Uploaded part number :", partNumber);
        } else {
          check = false;
        }
      }
    }
    // Go to tar upload page
  } catch (e) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@     ERROR     @@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(e);
  }
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log("@@@@@@@@@@@@@@@@@@ TAR UPLOAD DONE @@@@@@@@@@@@@@@@@@");
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
};

// * 제조사 풀 네임을 여기에 입력
const siteNames = ["Littelfuse [LITTELFUSE]^LITTELFUSE", "HARTING Technology Group [HARTING]^HARTING"];

crawler(siteNames);

// Weidmuller [WEIDMULLER]^Weidmuller
// WAGO Kontakttechnik GmbH & Co. KG [WAGO]^WAGO
// HARTING Technology Group [HARTING]^HARTING
// Keystone Electronics Corp. [KEYSTONE]^Keystone
// Schneider Electric [SCHNEIDER]^Schneider
// TDK Electronics [TDK]^TDK
