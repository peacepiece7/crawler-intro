const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config();

const cralwer = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size=1280,1280"] });
    await browser.userAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    );
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

    // * other method
    await page.waitForSelector("#email");
    await page.type("#email", process.env.FACE_BOOK_ID);
    await page.type("#pass", process.env.FACE_BOOK_PASSWORD);
    await page.click("._6ltg button");

    await page.waitForResponse(
      (response) => {
        // console.log("origin url is ... ", response.url());
        console.log("login_attmpt response is ...", response.url().includes("login_attempt"));
        console.log("Privacy_mutation_token is ... ", response.url().includes("privacy_mutation_token"));
        return response.url().includes("privacy_mutation_token");
      },
      { timeout: 3000 },
    );
    const start = new Date();
    // ? login_attempt waitForRequest, waitForResponse, response.url().includes("..")  ,privacy_mutation_token
    await page.waitForTimeout(3000);
    const done = new Date();
    console.log(done - start);
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
