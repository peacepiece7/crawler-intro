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
    folder: "Renesas Electronics",
    keyword: "Renesas Technology Corp [RENESAS]^233",
  },
  {
    folder: "Tripp Lite",
    keyword: "Tripp Lite. All Rights Reserved [TRIPPLITE]^1008",
  },
  {
    folder: "Renesas IDT",
    keyword: "Renesas Technology Corp [RENESAS]^233",
  },
  {
    folder: "Toshiba",
    keyword: "Toshiba Semiconductor [TOSHIBA]^163",
  },
  {
    folder: "TE Connectivity AMP",
    keyword: "TE Connectivity Ltd [TEC]^1049",
  },
  {
    folder: "Switchcraft",
    keyword: "Switchcraft, Inc. [SWITCH]^818",
  },
  {
    folder: "TE Connectivity",
    keyword: "TE Connectivity Ltd [TEC]^1049",
  },
  {
    folder: "Infineon IR",
    keyword: "Infineon Technologies AG [INFINEON]^211",
  },
  {
    folder: "Microchip Technology Atmel",
    keyword: "ATMEL Corporation [ATMEL]^20",
  },
  {
    folder: "Omron Automation and Safety",
    keyword: "Omron Electronics LLC [OMRON]^250",
  },
  {
    folder: "panasonic",
    keyword: "Panasonic Semiconductor [PANASONIC]^115",
  },
  {
    folder: "Panasonic Industrial Devices",
    keyword: "Panasonic Semiconductor [PANASONIC]^115",
  },
  {
    folder: "Phihong",
    keyword: "Phihong USA Inc. [PHIHONG]^650",
  },
  {
    folder: "Microchip Technology",
    keyword: "Microchip Technology [MICROCHIP]^97",
  },
  {
    folder: "Omron Electronics",
    keyword: "Omron Electronics LLC [OMRON]^250",
  },
  {
    folder: "Littelfuse",
    keyword: "Littelfuse [LITTELFUSE]^87",
  },
  {
    folder: "Micro Commercial Components (MCC)",
    keyword: "Micro Commercial Components [MCC]^94",
  },
  {
    folder: "onsemi Fairchild",
    keyword: "ON Semiconductor [ONSEMI]^112",
  },
  {
    folder: "Cosel",
    keyword: "COSEL CO., LTD. [COSEL]^1453",
  },
  {
    folder: "ebm-papst",
    keyword: "ebm-papst [EBMPAPST]^866",
  },
  {
    folder: "EPCOS TDK",
    keyword: "TDK Electronics [TDK]^252",
  },
];

crawler(option);
