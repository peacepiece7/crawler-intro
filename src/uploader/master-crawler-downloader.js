const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { installMouseHelper } = require("../service/install-mouse-helper");
const { forEach } = require("lodash");
dotenv.config();

const dir = path.join(__dirname, "..", "..", "..", "master-crawler");

fs.readdir(dir, null, (err) => {
  if (err) {
    fs.mkdirSync(dir);
  } else {
    console.log("master-crawler directory가 존재합니다");
  }
});

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size:1720,1400"],
    });
    await browser.userAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
    );

    let page = await browser.newPage();
    await page.setViewport({
      width: 1520,
      height: 1280,
    });
    await installMouseHelper(page);

    // 작동 안하농.. alert아닌가
    page.on("dialog", async (dialog) => {
      try {
        dialog.defaultValue("master");
        await dialog.dismiss();
      } catch (err) {
        console.log(err);
        console.log("dialog error");
      }
    });
    await page.goto("http://115.22.68.60/master/crawl/index.jsp?pre=1", { waitUntil: "networkidle0" });

    console.log("미우스 헬퍼 시작");
    await page.mouse.move(210, 85);
    await page.waitForTimeout(1000);
    await page.mouse.click(210, 85);

    await page.waitForTimeout(2000);

    console.log("제조사 리스트 생성");
    // "/"잘라내야 함
    const manufactureList = await parseManufactureList(page);
    console.log(manufactureList);
    // manufactureList.forEach((e) => {
    //   const manufactureDir = `${dir}/${e}`;
    //   fs.readdir(manufactureDir, null, (isExist) => {
    //     if (isExist) {
    //       fs.mkdirSync(manufactureDir);
    //     }
    //   });
    // });
  } catch (error) {
    console.log(error);
  }
};

crawler();

// promise로 manufacture directory 비동기 생성
// err가 생성되면 바로 종료되어버림..
function makeManufactureDirectory(mfDir) {
  return new Promise((resolve, reject) => {
    const manufactureDir = `${dir}/${mfDir}`;
    fs.readdir(manufactureDir, null, (err) => {
      if (err) {
        fs.mkdirSync(manufactureDir);
        return resolve(`${mfDir} 생성`);
      }
      resolve(`${mfDir}가 이미 존재합니다.`);
    });
  });
}

async function parseManufactureList(page) {
  const list = await page.evaluate(() => {
    const name = Array.from(document.querySelectorAll("#mfr")).map((v, i) => {
      if (v.textContent) {
        return v.textContent;
      }
      return `ERROR INDEX ${i}`;
    });
    return name;
  });

  return list;
}
