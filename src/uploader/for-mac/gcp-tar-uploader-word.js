const dotenv = require("dotenv");
dotenv.config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const crawler = async () => {
  try {
    const filePath = __dirname.split("crawler-intro")[0] + "tar";
    const tarList = fs.readdirSync(filePath);

    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size:1400,1400"],
    });

    await browser.userAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
    );

    let page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 1280,
    });

    page.on("console", (log) => {
      if (log._type !== "warning") {
        console.log(log._text);
      }
    });

    await page.goto("http://34.64.149.214/master/login.jsp");
    await page.waitForSelector("input[name=id]");

    // * env 문자열로 변경
    await page.type("input[name=id]", process.env.NEW_ALLDATASHEET_ID);
    await page.type("input[name=pwd]", process.env.new_ALLDATASHEET_PASSWORD);
    await page.waitForTimeout(1000);

    await page.click("input[type=submit]");
    await page.waitForTimeout(Math.floor(Math.random() * 3000 + 2000));

    for (let i = 0; i < tarList.length - 1; i++) {
      page = await browser.newPage();
      await page.goto("http://34.64.149.214/master/uphtml_sub_all.jsp", { waitUntil: "networkidle0" });
      const tarName = tarList[i].slice(0, tarList[i].length - 4);
      await page.type("input[name=seekname]", tarName);
      await page.click("input[name=cc]");
      await page.waitForSelector("body > center table tbody tr:nth-child(2) td");
      await page.waitForTimeout(1000);

      const partNumber = await page.evaluate(() => {
        if (document.querySelector("body > center table tbody tr[align=center]:nth-child(2) td")) {
          return document.querySelector("body > center table tbody tr[align=center]:nth-child(2) td").textContent;
        }
        return null;
      });

      if (partNumber) {
        const tarPath = `${filePath}\\${partNumber}.tgz`;
        const inputElement = await page.$("input[type=file]");
        await inputElement.uploadFile(tarPath);
        await page.waitForTimeout(1000);
        await page.click("input[name=B1]");
        await page.waitForTimeout(Math.floor(Math.random() * 1000 + 5000));
        console.log("Uploaded part number :", partNumber);
      } else {
        console.log(`${tarName}.tgz 가 존재하지 않습니다.`);
      }
    }
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

crawler();
