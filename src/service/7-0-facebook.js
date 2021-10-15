const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const cralwer = async () => {
  try {
    //! notification 없애는 args
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1280,1280", "--disable-notifications"] });
    await browser.userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36");
    const page = await browser.newPage();
    page.setViewport({
      width: 1080,
      height: 1080,
    });
    await page.goto("https://ko-kr.facebook.com/");

    // * page.evaluate()
    // const id = process.env.FACE_BOOK_ID;
    // const password = process.env.FACE_BOOK_PASSWORD;
    // await page.evaluate(
    //   (id, password) => {
    //     document.querySelector("#email").value = id;
    //     document.querySelector("#pass").value = password;
    //   },
    //   id,
    //   password,
    // );

    // https://github.com/ZeroCho/nodejs-crawler/blob/master/8.facebook-login-logout/index.js

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
    await page.waitForTimeout(3000);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(3000);

    const accountIconEl = ".ehxjyohh.kr520xx4.poy2od1o.b3onmgus.hv4rvrfc.n7fi1qx3 div:first-child span";
    const logoutEl = ".b20td4e0.muag1w35 > div:last-child";

    await page.click(accountIconEl);
    await page.waitForTimeout(1000);
    await page.waitForSelector(logoutEl);
    await page.click(logoutEl);
    // await page.close();
    // await browser.close();
  } catch (err) {
    console.log(err);
  }
};

cralwer();

// * waitForResponse
// await page.waitForResponse(() => response.url().includes("privacy_mutation_token");)

// * drag
// await page.mouse.move(100, 100)
// await page.mouse.down()
// await page.mouse.move(200, 100)
// await page.mouse.up()

// * keyboard
// await page.keyboard.press("Escape")

// * disable notifications
// const browser = await puppeteer.launch({ headless: false, args: ["--disable-notifications"] });

// * typing
// await page.click("#eamil")
// await page.keyboard.down("ShiftLeft")
// await page.keyboard.press("KeyZ")
// await page.keyboard.press("KeyE")
// await page.keyboard.press("KeyR")
// await page.keyboard.press("KeyO")
// await page.keyboard.down("ShiftLeft")
// await page.keyboard.press("KeyC")
// await page.keyboard.press("KeyH")
// await page.keyboard.press("KeyO")
// => ZeroCho
