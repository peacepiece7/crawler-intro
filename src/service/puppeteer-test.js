const puppeteer = require("puppeteer");
const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // * evalueate안에서 console.log찍기 위해 필요한 코드
    // prettier-ignore
    page.on('console', (log) => {
      if(log._type !== "warning"){
        console.log(log._text)
      }
    });

    await page.goto("https://www.gsc.coffee/goods/goods_list.php?cateCd=001");
    const result = await page.evaluate(() => {
      console.log("Hello, world!");
      data = [];
      [...document.querySelectorAll(".item_name")].map((el, idx) => {
        data[idx] = { name: el.textContent };
      });
      [...document.querySelectorAll(".item_price")].map((el, idx) => {
        const price = el.textContent.replace(/\s*/g, "");
        if (price) {
          data[idx] = [data[idx], { price }];
        }
      });
      return data;
    });
    console.log(result[0][0]);

    await page.waitForTimeout(3000);
    await page.close();
    await browser.close();
  } catch (e) {
    console.log(e);
  }
};

crawler();
