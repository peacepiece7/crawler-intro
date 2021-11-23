const dotenv = require("dotenv");
dotenv.config();
const puppeteer = require("puppeteer");
const fs = require("fs");

// * upload tar 파일에 저장해주세요
const crawler = async (siteName) => {
  const FilePath = __dirname.split("crawler-intro")[0] + "upload2";
  const input = fs.readdirSync(FilePath).toString();

  const pdfFiles = input.split(",").filter((file) => {
    if (file.includes(".pdf") || file.includes(".PDF")) {
      return file;
    }
  });
  const imgFiles = input.split(",").filter((file) => {
    if (file.includes(".gif") || file.includes(".GIF")) {
      return file;
    }
  });
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--window-size:1400,1400"],
    });

    // * 각 컴퓨터 마다 navigator.userAgent 확인 후 수정
    await browser.userAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
    );

    let page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 1280,
    });

    // evalueate안에서 console.log찍기 위해 필요한 코드
    // prettier-ignore
    page.on('console', (log) => {
        if(log._type !== "warning"){
          console.log(log._text)
        }
      });

    // Login
    await page.goto("http://34.64.149.214/master/login.jsp");
    await page.waitForSelector("input[name=id]");

    // * env 문자열로 변경
    await page.type("input[name=id]", process.env.NEW_ALLDATASHEET_ID);
    await page.type("input[name=pwd]", process.env.NEW_ALLDATASHEET_PASSWORD);
    await page.waitForTimeout(1000);
    await page.click("input[type=submit]");

    await page.waitForTimeout(1000);

    // Go to registor
    for (let i = 0; i < pdfFiles.length; i++) {
      try {
        page = await browser.newPage();
        await page.goto("http://34.64.149.214/master/datasheet_reg.jsp");
        await page.waitForSelector("input[name=info]");
        await page.waitForTimeout(1000);

        const pdfName = pdfFiles[i].toString().slice(0, pdfFiles[i].length - 4);
        await page.waitForTimeout(1000);
        await page.type("input[name=info]", pdfName);
        await page.type(`input[name=sFactory]`, siteName);
        const pdfFile = await page.$("input[name=pdf]");
        const pdfPath = `${FilePath}\\${pdfFiles[i]}`;
        pdfFile.uploadFile(pdfPath);
        const imgPath = `${FilePath}\\${imgFiles[i]}`;
        const imageFile = await page.$("input[name=img]");
        imageFile.uploadFile(imgPath);
        await page.waitForTimeout(Math.floor(Math.random() * 10000 + 2000));
        await page.click("input[value=등록하기]");
        console.log("UPLOADED PAR NUMBER IS", pdfName);
        await page.waitForTimeout(5000);
      } catch (e) {
        console.log(e);
      }
    }
  } catch (e) {
    console.log(e);
  }
  console.log("@@@@@@@@@@@@@@@@@@@@@ PDF UPLOAD DONE @@@@@@@@@@@@@@@@@@@@@");
};

// * 제조사 풀 네임을 여기에 입력
crawler("HARTING Technology Group [HARTING]^1414");

// WAGO Kontakttechnik GmbH & Co. KG [WAGO]^1451
// HARTING Technology Group [HARTING]^1414
// Weidmuller [WEIDMULLER]^786
