const puppeteer = require("puppeteer");

const cralwer = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false, args: ["--window-size=1480,1480"], defaultViewport: { width: 1280, height: 1280 } });
    await browser.userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36");
    // secret window mode (chating, test)
    const context1 = await browser.createIncognitoBrowserContext();
    const context2 = await browser.createIncognitoBrowserContext();
    const context3 = await browser.createIncognitoBrowserContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    const page3 = await context3.newPage();

    await page1.goto("http://www.whatismyproxy.com/");
    await page2.goto("http://www.whatismyproxy.com/");
    await page3.goto("http://www.whatismyproxy.com/");
  } catch (err) {
    console.log(err);
  }
};

cralwer();

// SOCKS5 = Deep web browser header
// HIA = High Annonimity
// NOA = Not of Annonimity

// https://spys.one/en/free-proxy-list/
// postman으로 보냈을 떄, 페이지 정보가 잘 나오면 크롤링하기 쉬운 사이트
