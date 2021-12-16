const dotenv = require('dotenv');
dotenv.config();
const puppeteer = require('puppeteer');
const fs = require('fs');

// * upload tar 파일에 저장해주세요
const crawler = async (options) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size:1400,1400'],
    });

    await browser.userAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
    );

    let page = await browser.newPage();
    await page.setViewport({
      width: 1280,
      height: 1280,
    });

    page.on('console', (log) => {
      if (log._type !== 'warning') {
        console.log(log._text);
      }
    });

    // Login
    await page.goto('http://34.64.149.214/master/login.jsp');
    await page.waitForSelector('input[name=id]');

    await page.type('input[name=id]', process.env.NEW_ALLDATASHEET_ID);
    await page.type('input[name=pwd]', process.env.NEW_ALLDATASHEET_PASSWORD);
    await page.waitForTimeout(1000);
    await page.click('input[type=submit]');

    if (typeof options === 'string') {
      const FilePath = `${__dirname.split('crawler-intro')[0]}upload`;
      const input = fs.readdirSync(FilePath).toString();
      const siteName = option[i].keyword;
      const pdfFiles = input.split(',').filter((file) => {
        if (file.includes('.pdf') || file.includes('.PDF')) {
          return file;
        }
      });
      const imgFiles = input.split(',').filter((file) => {
        if (file.includes('.gif') || file.includes('.GIF')) {
          return file;
        }
      });

      await page.waitForTimeout(1000);
      // PDF 등록
      for (let i = 0; i < pdfFiles.length; i++) {
        // const page = await browser.newPage();
        await page.goto('http://34.64.149.214/master/datasheet_reg.jsp', { waitUntil: 'networkidle0' });
        const pdfName = pdfFiles[i].toString().slice(0, pdfFiles[i].length - 4);
        await page.waitForTimeout(1000);
        await page.type('input[name=info]', pdfName);
        await page.type(`input[name=sFactory]`, siteName);
        const pdfFile = await page.$('input[name=pdf]');
        const pdfPath = `${FilePath}\\${pdfFiles[i]}`;
        pdfFile.uploadFile(pdfPath);
        const imgPath = `${FilePath}\\${imgFiles[i]}`;
        const imageFile = await page.$('input[name=img]');
        imageFile.uploadFile(imgPath);
        await page.waitForTimeout(Math.floor(Math.random() * 4000 + 2000));
        await page.click('input[value=등록하기]');
        console.log('Uploaded part number :', pdfName);
        await page.waitForTimeout(Math.floor(Math.random() * 4000 + 2000));
      }
    } else {
      for (let i = 0; i < options.length; i++) {
        const FilePath = `${__dirname.split('crawler-intro')[0]}upload/${options[i].folder}`;
        const input = fs.readdirSync(FilePath).toString();
        const siteName = option[i].keyword;
        const pdfFiles = input.split(',').filter((file) => {
          if (file.includes('.pdf') || file.includes('.PDF')) {
            return file;
          }
        });
        const imgFiles = input.split(',').filter((file) => {
          if (file.includes('.gif') || file.includes('.GIF')) {
            return file;
          }
        });

        await page.waitForTimeout(1000);
        // PDF 등록
        for (let i = 0; i < pdfFiles.length; i++) {
          const page = await browser.newPage();
          await page.goto('http://34.64.149.214/master/datasheet_reg.jsp', { waitUntil: 'networkidle0' });
          const pdfName = pdfFiles[i].toString().slice(0, pdfFiles[i].length - 4);
          await page.waitForTimeout(1000);
          await page.type('input[name=info]', pdfName);
          await page.type(`input[name=sFactory]`, siteName);
          const pdfFile = await page.$('input[name=pdf]');
          const pdfPath = `${FilePath}\\${pdfFiles[i]}`;
          pdfFile.uploadFile(pdfPath);
          const imgPath = `${FilePath}\\${imgFiles[i]}`;
          const imageFile = await page.$('input[name=img]');
          imageFile.uploadFile(imgPath);
          await page.waitForTimeout(Math.floor(Math.random() * 4000 + 2000));
          await page.click('input[value=등록하기]');
          console.log('Uploaded part number :', pdfName);
          await page.waitForTimeout(Math.floor(Math.random() * 4000 + 2000));
        }
      }
    }
  } catch (e) {
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log('@@@@@@@@@@@@@@@@@@@@     ERROR     @@@@@@@@@@@@@@@@@@@@');
    console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
    console.log(e);
  }
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@ PDF UPLOAD DONE @@@@@@@@@@@@@@@@@@@@@');
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
};

const option = [
  {
    folder: 'Amphenol Wilcoxon',
    keyword: 'Amphenol Corporation [AMPHENOL]^795',
  },
  {
    folder: 'Analog Devices',
    keyword: 'Analog Devices [AD]^15',
  },
];

crawler(option);

// * 제조사 풀 네임을 여기에 입력
// crawler("Schneider Electric [SCHNEIDER]^1309");
// WAGO Kontakttechnik GmbH & Co. KG [WAGO]^1451
// HARTING Technology Group [HARTING]^1414
// Weidmuller [WEIDMULLER]^786
// Keystone Electronics Corp. [KEYSTONE]^1313
// Schneider Electric [SCHNEIDER]^1309
// 3M Electronics [3M]^353
