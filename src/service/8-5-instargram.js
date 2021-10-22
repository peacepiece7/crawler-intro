const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const fs = require("fs");

// ? ZeroCho Facebook crawler (좋아요 누르고 개시글 삭제, 데이터 mysql에 저장 )
// ? https://github.com/ZeroCho/nodejs-crawler/blob/master/10.facebook-crawling/index.js

// * public cloud에서 crawler돌리면 계정 차단 당할 확률이 높음

const cralwer = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1080,1080", "--disable-notifications"] });
    await browser.userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36");
    const page = await browser.newPage();
    page.setViewport({
      width: 720,
      height: 720,
    });

    await page.goto("https://www.instagram.com/?hl=ko");

    await page.waitForSelector(".KPnG0");
    await page.click("span.KPnG0");

    await page.waitForNavigation();
    await page.type("#email", process.env.FACE_BOOK_ID);
    await page.type("#pass", process.env.FACE_BOOK_PASSWORD);
    await page.click("#loginbutton");

    await page.waitForNavigation();
  } catch (err) {
    console.log(err);
  }
};

cralwer();
