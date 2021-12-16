// document.querySelectorAll("figure .MorZF img.YVj9w")
const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");

const crwaler = async () => {
  try {
    // window.innerWidth, .innerHeight
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1440,796"] });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1440,
      height: 796,
    });
    // navigator.userAgent
    await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36");

    // * evalueate안에서 console.log찍기 위해 필요한 코드
    // prettier-ignore
    page.on('console', (log) => {
      if(log._type !== "warning"){
        console.log(log._text)
      }
    });
    await page.goto("https://unsplash.com/");
    let result = [];

    while (result.length <= 30) {
      // scroll bar가 바닥에 붙어서 트리거가 발생하지 않을 경우
      // 스크롤 위에서 ~

      let srcs = await page.evaluate(() => {
        window.scrollTo(0, 0);
        let imgs = [];
        const imgEls = document.querySelectorAll("figure .MorZF");
        if (imgEls.length) {
          imgEls.forEach((v) => {
            let src = v.querySelector("img.YVj9w").src;
            if (src) {
              imgs.push(src);
            }
            v.parentElement.removeChild(v);
          });
        }
        // scroll by 스크롤 여기서 ~
        window.scrollBy(0, 500);
        return imgs;
      });
      // setTimeOut 3000ms 지나면 자동으로 error
      await page.waitForSelector("figure .MorZF");
      result = result.concat(srcs);
      result.forEach(async (src) => {
        try {
          const result = await axios.get(src.replace(/\?.*$/, ""), {
            responseType: "arraybuffer",
          });
          fs.writeFileSync(`src/coffee_assets/tmp/${new Date().valueOf()}.jpeg`, result.data);
        } catch (err) {
          console.log(err);
        }
      });
    }
    await page.close();
    await browser.close();
  } catch (err) {
    console.log(err);
  }
};

crwaler();
