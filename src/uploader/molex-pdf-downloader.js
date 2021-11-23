// https://www.molex.com/molex/search/partSearchPage?isseriesPagination=yes&itemListRe=&itemList=&pQuery=q%253D*%253A*%2540fq%253Dcollection%253Aimpulse%2540fq%253Dcategory%253A%2522Antennas%2522%2540fq%253Dtype%253A*Wi-Fi*%2540fq%253D&offset=20&currentQuery=
// `https://www.molex.com/molex/search/partSearchPage?isseriesPagination=yes&itemListRe=&itemList=&pQuery=q%253D*%253A*%2540fq%253Dcollection%253Aimpulse%2540fq%253Dcategory%253A%2522Antennas%2522%2540fq%253Dtype%253A*Wi-Fi*%2540fq%253D&currentQuery=&offset=${offsetNumber}`
// document.querySelector('span').shadowRoot.querySelector('#shadow'); // <div id="shadow">야호!</div>

const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-notifications'],
      defaultViewport: { width: 1780, height: 1780 },
    });
    await browser.userAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36'
    );

    const baseUrl =
      'https://www.molex.com/molex/search/deepSearch?pQuery=category%253A%2522Antennas%2522%2540type%253A*Wi-Fi*';
    let isExist = true;
    let offsetNumber = 0;
    while (isExist) {
      let page = await browser.newPage();
      await page.setViewport({ width: 1420, height: 1420 });
      await page.goto(`${baseUrl}&offset=${offsetNumber}`);
      await page.waitForTimeout(5000);
      const contents = await page.evaluate(() => {
        const content = document.querySelectorAll('.part-desc h3 a');
        if (content.length >= 1) {
          return true;
        } else {
          return false;
        }
      });

      if (contents) {
        await page.waitForTimeout(1000);
        const downloadLinks = await page.evaluate(() => {
          const links = Array.from(
            document.querySelectorAll('.part-desc h3 a')
          ).map((v) => v.href);
          return links;
        });
        console.log('다운로드 링크 개수 : ', downloadLinks.length);
        for (let i = 0; i < downloadLinks.length; i++) {
          page = await browser.newPage();
          await page.goto(downloadLinks[i]);
          await page.waitForTimeout(2000);
          const pdfLink = await page.evaluate(() => {
            const link = document.querySelector('.noline').href;
            return link;
          });
          const pdfName = await page.evaluate(() => {
            const name = document
              .querySelector('.part-number h1')
              .textContent.split(':')[1];
            return name;
          });
          if (!pdfLink) {
            console.log('PDF 링크가 존재하지 않습니다.');
          } else {
            axios({
              method: 'get',
              url: pdfLink,
              responseType: 'arraybuffer',
            })
              .then((res) => {
                if (!pdfName) {
                  // prettier-ignore
                  fs.writeFileSync(`${__dirname}/${Date.now()}이름없음.pdf`, res.data);
                } else {
                  fs.writeFileSync(`${__dirname}/${pdfName}.pdf`, res.data);
                }
              })
              .catch((err) => {
                console.log('check the axios');
                console.log(err);
              });
          }
          page.close();
        }
      } else {
        isExist = false;
      }
    }
  } catch (err) {
    console.log('@@@@ error @@@@');
    console.log(err);
  }
  console.log('@@@@@@@@@@@@@@@@@@@@ DOWNLOAD DONE @@@@@@@@@@@@@@@@@@@@');
};

crawler();
