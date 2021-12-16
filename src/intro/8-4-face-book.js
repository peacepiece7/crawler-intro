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

    await page.goto("https://ko-kr.facebook.com/");

    // * Login
    await page.waitForSelector("#email");
    await page.keyboard.type("#email", process.env.FACE_BOOK_ID);
    await page.type("#pass", process.env.FACE_BOOK_PASSWORD);
    await page.click("._6ltg button");

    // * SPA(react)에서 쓰기 좋은 메서드
    await page.waitForResponse((response) => {
      // console.log("origin url is ... ", response.url());
      console.log("login_attmpt response is ...", response.url().includes("login_attempt"));
      console.log("Privacy_mutation_token is ... ", response.url().includes("privacy_mutation_token"));
      return response.url().includes("privacy_mutation_token");
    });
    // ? login_attempt waitForRequest, waitForResponse, response.url().includes("..")  ,privacy_mutation_token

    // * img tag가 랜더링 될 때 까지 기다림
    await page.waitForSelector(".l9j0dhe7[id^=jsc_c] > .l9j0dhe7 img");
    await page.waitForTimeout(Math.floor(Math.random() * 2000));

    // * 광고글을 제외한 개시글에 좋아요 누르기
    const likeBtn = await page.$("[id^=hyperfeed_story_id]:first-child ._666k a");
    await page.evaluate((like) => {
      // * sponser는 해당 태그에 이상한 문자가 들어있음
      const sponser = document.querySelector("[id^=hyperfeed_story_id]:first-child").textContent.includes("sdsdSononSsosoSredredSSS");
      // * Boolean type is string
      if (!sponser && like.getAttribute("aria-pressed") === "false") {
        like.click();
      } else if (sponser && like.getAttribute("aria-pressed") === "true") {
        like.click();
      }
    }, likeBtn);

    // * 파싱 후 해당 개시글 삭제
    const snappet = await page.evaluate(() => {
      const imgPath = document.querySelector(".l9j0dhe7[id^=jsc_c] > .l9j0dhe7 img").src;
      const provider = document.querySelector("div[role=feed] .buofh1pr span").textContent;
      // 좋아요 버튼 테그
      // const likeBtn = document.querySelector("div[aria-label=좋아요]");

      // * 아래 두 줄은 같은 작업을 진행 함
      imgPath.parentNode.removeChild(imgPath);
      document.querySelector("div[role=feed] div[data-pagelet]").remove();
      return { imgPath, provider };
    });

    // * axios로 arraybuffer를 가져온 뒤 저장
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
