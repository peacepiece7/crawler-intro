const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();
const axios = require("axios");
const fs = require("fs");

const imgDir = fs.readdir("src/assets/face-book/img", (err) => {
  if (err) {
    fs.mkdirSync("src/assets/face-book/img");
  }
});

const tmpDir = fs.readdir("src/assets/face-book/tmp", (err) => {
  if (err) {
    fs.mkdirSync("src/service/face-book/tmp");
  }
});

const cralwer = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1080,1080", "--disable-notifications"] });
    await browser.userAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    );
    const page = await browser.newPage();
    page.setViewport({
      width: 720,
      height: 720,
    });

    await page.goto("https://ko-kr.facebook.com/");

    // * other method
    await page.waitForSelector("#email");
    await page.type("#email", process.env.FACE_BOOK_ID);
    await page.type("#pass", process.env.FACE_BOOK_PASSWORD);
    await page.click("._6ltg button");

    // SPA(react)에서 쓰기 좋은 메서드
    await page.waitForResponse((response) => {
      // console.log("origin url is ... ", response.url());
      console.log("login_attmpt response is ...", response.url().includes("login_attempt"));
      console.log("Privacy_mutation_token is ... ", response.url().includes("privacy_mutation_token"));
      return response.url().includes("privacy_mutation_token");
    });
    // ? login_attempt waitForRequest, waitForResponse, response.url().includes("..")  ,privacy_mutation_token

    // 이미지 로딩이 제일 느림
    await page.waitForSelector(".l9j0dhe7[id^=jsc_c] > .l9j0dhe7 img");
    await page.waitForTimeout(Math.floor(Math.random() * 2000));

    const snappet = await page.evaluate(() => {
      // Prase first tag and then remove it
      const imgPath = document.querySelector(".l9j0dhe7[id^=jsc_c] > .l9j0dhe7 img").src;
      const provider = document.querySelector("div[role=feed] .buofh1pr span").textContent;
      // const likeBtn = document.querySelector("div[aria-label=좋아요]");
      document.querySelector("div[role=feed] div[data-pagelet]").remove();
      return { imgPath, provider };
    });

    console.log("snappet IS ", snappet);

    let config = {
      method: "GET",
      url: snappet.imgPath,
      responseType: "arraybuffer",
    };

    await axios(config).then((response) => {
      fs.writeFileSync(`src/assets/face-book/img/${snappet.provider.trim()}.jpeg`, response.data);
    });

    await page.waitForTimeout(3000);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(3000);

    // * Image tag
    // document.querySelectorAll(".l9j0dhe7[id^=jsc_c] > .l9j0dhe7")

    const accountIconEl = ".ehxjyohh.kr520xx4.poy2od1o.b3onmgus.hv4rvrfc.n7fi1qx3 div:first-child span";
    const logoutEl = ".b20td4e0.muag1w35 > div:last-child";

    // await page.click(accountIconEl);
    // await page.waitForTimeout(1000);
    // await page.waitForSelector(logoutEl);
    // await page.click(logoutEl);
    // await page.close();
    // await browser.close();
  } catch (err) {
    console.log(err);
  }
};

cralwer();
