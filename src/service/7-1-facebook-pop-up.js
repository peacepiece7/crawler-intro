const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const cralwer = async () => {
  try {
    //! notification 없애는 args
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1280,1280", "--disable-notifications"] });
    await browser.userAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    );
    const page = await browser.newPage();
    page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://ko-kr.facebook.com/");

    // 이벤트 리스너는 이벤트가 일어나기전에 항상 먼저 정의해줘야함!!
    page.on("dialog", async (dialog) => {
      console.log(dialog.type(), dialog.message());
      // promis dismiss
      // promis accept
      await diaglog.dismiss();
    });

    await page.evaluate(() => {
      alert("이 창이 꺼져야 다음으로 넘어갑니다");
      location.href = "http://zerocho.com";
    });

    // await page.close();
    // await browser.close();
  } catch (err) {
    console.log(err);
  }
};

cralwer();

// pull 기능이 puppeteer x
