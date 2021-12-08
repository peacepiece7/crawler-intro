const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { installMouseHelper } = require("../service/install-mouse-helper");
const axios = require("axios");

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
    console.log("미우스 헬퍼 끝");

    console.log("제조사 리스트 생성 시작");
    const manufactureList = await parseManufactureList(page);
    const filteredManufactureList = manufactureList.filter((val, idx) => manufactureList.indexOf(val) === idx);
    console.log(filteredManufactureList);
    filteredManufactureList.forEach((e) => {
      const manufactureDir = `${dir}/${e}`;
      fs.readdir(manufactureDir, null, (error) => {
        if (error) {
          return fs.mkdirSync(manufactureDir);
        }
      });
    });
    console.log("제조사 리스트 생성 끝");
    console.log("pdf parse 시작");
    const pdfs = await page.evaluate(() => {
      const result = [];
      Array.from(document.querySelectorAll("tbody tr")).map((v, idx) => {
        // pdf link
        const link = v.querySelector("td:nth-child(5) a").href;

        // part number
        const pn = v.querySelector(".pname").textContent;

        // manufacture
        let mf = v.querySelector("#mfr").textContent.split("/");
        if (mf[1]) {
          mf = `${mf[0].trim()} ${mf[1].trim()}`;
        } else {
          mf = mf[0];
        }
        result.push({ mf: mf, pn: pn, link: link });
      });
      return result;
    });
    console.log(pdfs);

    pdfs.map((v, idx) => {
      setTimeout(() => {
        if (v.link.includes(".pdf") || v.link.includes(".PDF")) {
          axios({
            method: "GET",
            url: v.link,
            responseType: "arraybuffer",
          })
            .then((res) => {
              console.log(`download pn : ${v.pn}, index : ${idx}, last index : ${pdfs.length - 1}`);
              fs.writeFileSync(`${dir}/${v.mf}/${v.pn}.pdf`, res.data);
            })
            .catch((err) => {
              console.log("@@ ERROR @@");
              console.log(v.pn);
              console.log(err);
            });
        } else {
          fs.writeFileSync(`${dir}/${v.mf}/${v.pn}.txt`, "");
        }
      }, 300 * idx);
    });
    await page.close();
    await browser.close();
  } catch (error) {
    console.log(error);
  }
};

crawler();

// promise로 manufacture directory 비동기 생성
// err가 생성되면 바로 종료되어버림..

async function parseManufactureList(page) {
  const list = await page.evaluate(() => {
    const name = Array.from(document.querySelectorAll("#mfr")).map((v) => {
      return v.textContent && v.textContent;
    });
    const result = name.map((v) => {
      const mf = v.split("/");
      if (!mf[1]) {
        return mf[0];
      }
      return `${mf[0].trim()} ${mf[1].trim()}`;
    });
    return result;
  });
  return list;
}
