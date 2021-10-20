const dotenv = require("dotenv");
dotenv.config();
const puppeteer = require("puppeteer");
const { installMouseHelper } = require("./install-mouse-helper");
const fs = require("fs");

const crawler = async (siteName) => {
  const input = fs.readdirSync("C:\\Users\\INTERBIRD\\Desktop\\upload").toString();

  const pdfFiles = input.split(",").filter((file) => {
    if (file.includes(".pdf")) {
      return file;
    }
  });

  const imgFiles = input.split(",").filter((file) => {
    if (file.includes(".GIF")) {
      return file;
    }
  });
  try {
    const browser = await puppeteer.launch({ headless: false, args: ["--window-size:1400,1400"] });
    await browser.userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36");
    const page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 1280,
    });

    // * evalueate안에서 console.log찍기 위해 필요한 코드
    // prettier-ignore
    page.on('console', (log) => {
        if(log._type !== "warning"){
          console.log(log._text)
        }
      });

    // * installs the helper to the page. Mouse will be visible in the subsequent navigation.
    await installMouseHelper(page);

    // Login
    await page.goto("http://34.64.149.214/master/login.jsp");
    await page.waitForSelector("input[name=id]");
    await page.type("input[name=id]", process.env.NEW_ALLDATASHEET_ID);
    await page.type("input[name=pwd]", process.env.NEW_ALLDATASHEET_PASSWORD);
    await page.waitForTimeout(1000);
    await page.click("input[type=submit]");

    await page.waitForTimeout(1000);

    // Go to registor
    for (let i = 0; i <= pdfFiles.length; i++) {
      try {
        await page.goto("http://34.64.149.214/master/datasheet_reg.jsp");
        await page.waitForSelector("input[name=info]");
        await page.waitForTimeout(Math.floor(Math.random() * 5000));
        console.log(pdfFiles[i], imgFiles[i]);
        await page.type("input[name=info]", pdfFiles[i].split(".")[0]);
        await page.waitForTimeout(Math.floor(Math.random() * 1000));
        await page.type(`input[name=sFactory]`, siteName);
        await page.waitForTimeout(Math.floor(Math.random() * 1000));
        const pdfFile = await page.$("input[name=pdf]");
        const pdfPath = `C:\\Users\\INTERBIRD\\Desktop\\upload\\${pdfFiles[i]}`;
        pdfFile.uploadFile(pdfPath);
        await page.waitForTimeout(Math.floor(Math.random() * 1000));
        const imgPath = `C:\\Users\\INTERBIRD\\Desktop\\upload\\${imgFiles[i]}`;
        const imageFile = await page.$("input[name=img]");
        imageFile.uploadFile(imgPath);
        await page.waitForTimeout(Math.floor(Math.random() * 1000));
      } catch (e) {
        console.log(e);
      }
    }
  } catch (e) {
    console.log(e);
  }
};

crawler("WAGO Kontakttechnik GmbH & Co. KG [WAGO]^1452");

// WAGO Kontakttechnik GmbH & Co. KG [WAGO]^1452
// HARTING Technology Group [HARTING]^1414
