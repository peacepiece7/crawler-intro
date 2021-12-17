const dotenv = require("dotenv");
dotenv.config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const crawler = async (options) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size:1400,1400"],
    });

    await browser.userAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
    );

    let page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 1280,
    });

    page.on("console", (log) => {
      if (log._type !== "warning") {
        console.log(log._text);
      }
    });

    // Login
    await page.goto("http://34.64.149.214/master/login.jsp");
    await page.waitForSelector("input[name=id]");

    await page.type("input[name=id]", process.env.NEW_ALLDATASHEET_ID);
    await page.type("input[name=pwd]", process.env.NEW_ALLDATASHEET_PASSWORD);
    await page.waitForTimeout(1000);
    await page.click("input[type=submit]");

    // * 인자가 문자열일 경우
    if (typeof options === "string") {
      const FilePath = `${__dirname.split("crawler-intro")[0]}upload`;
      const input = fs.readdirSync(FilePath).toString();
      const siteName = option[i].keyword;
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
      // PDF 등록
      await page.waitForTimeout(1000);
      for (let i = 0; i < pdfFiles.length; i++) {
        await page.goto("http://34.64.149.214/master/datasheet_reg.jsp", { waitUntil: "networkidle0" });
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
        await page.waitForTimeout(Math.floor(Math.random() * 2000 + 2000));
        await page.click("input[value=등록하기]");
        console.log("Uploaded part number :", pdfName);
        await page.waitForTimeout(Math.floor(Math.random() * 2000 + 2000));
      }
      // * 인자가 객체일 경우
    } else {
      for (let i = 0; i < options.length; i++) {
        const FilePath = `${__dirname.split("crawler-intro")[0]}upload/${options[i].folder}`;
        const input = fs.readdirSync(FilePath).toString();
        const siteName = option[i].keyword;
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
        // PDF 등록
        await page.waitForTimeout(1000);
        for (let i = 0; i < pdfFiles.length; i++) {
          const page = await browser.newPage();
          await page.goto("http://34.64.149.214/master/datasheet_reg.jsp", { waitUntil: "networkidle0" });
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
          await page.waitForTimeout(Math.floor(Math.random() * 4000 + 2000));
          await page.click("input[value=등록하기]");
          console.log("Uploaded part number :", pdfName);
          await page.waitForTimeout(Math.floor(Math.random() * 4000 + 2000));
        }
      }
    }
  } catch (e) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@     ERROR     @@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log(e);
  }
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  console.log("@@@@@@@@@@@@@@@@@@@@@ PDF UPLOAD DONE @@@@@@@@@@@@@@@@@@@@@");
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
};

const option = [
  {
    folder: "IDEC",
    keyword: "IDEC Corporation [IDEC]^1452",
  },
  {
    folder: "APC by Schneider Electric",
    keyword: "Schneider Electric [SCHNEIDER]^1309",
  },
  {
    folder: "Delta Electronics",
    keyword: "Delta Electronics, Inc. [DELTA]^248",
  },
  {
    folder: "Diodes Incorporated",
    keyword: "Diodes Incorporated [DIODES]^41",
  },
  {
    folder: "Fluke",
    keyword: "Fluke Corporation [FLUKE]^1350",
  },
  {
    folder: "Grayhill",
    keyword: "Grayhill, Inc [GRAYHILL]^493",
  },
  {
    folder: "Honeywell",
    keyword: "Honeywell Solid State Electronics Center [HONEYWELL]^272",
  },
  {
    folder: "Hammond Manufacturing",
    keyword: "Hammond Manufacturing Ltd. [HAMMOND]^968",
  },
];

crawler(option);
