const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { installMouseHelper } = require('../service/install-mouse-helper');
const axios = require('axios');
const readline = require('readline');

dotenv.config();

// for window directory
const dir = path.join(__dirname, '..', '..', '..', 'master-crawler');

// for mac test directory
// const dir = "./master-crawler-done";
console.log('@@@@@@  폴더의 기본 정렬 기준을 크기로 변경해주세요  @@@@@@ ');
console.log('이름 순으로 고정하면, 이름 고칠 때 엑셀의 순서가 변경됨!');

// master-crawler 디랙터리 생성
fs.readdir(dir, null, (err) => {
  if (err) {
    fs.mkdirSync(dir);
  }
});

// 크롤러 시작
const crawler = async (query) => {
  try {
    // for window
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--window-size:1720,1400'],
    });

    await browser.userAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36'
    );

    let page = await browser.newPage();
    await page.setViewport({
      width: 1520,
      height: 1280,
    });
    await installMouseHelper(page);

    await page.goto(`http://115.22.68.60/master/crawl/index.jsp?pre=${query}`, {
      waitUntil: 'networkidle0',
    });

    // 마우스 헬퍼 for 회사컴 (화면크기에 따라 조정이 필요)
    await page.mouse.move(210, 85);
    await page.waitForTimeout(1000);
    await page.mouse.click(210, 85);
    await page.waitForTimeout(2000);

    // for mac
    // await page.mouse.move(220, 125);
    // await page.waitForTimeout(3000);
    // await page.mouse.click(220, 125);
    // await page.waitForTimeout(2000);

    // 제조사 리스트 생성
    const manufactureList = await parseManufactureList(page);
    const filteredManufactureList = manufactureList.filter(
      (val, idx) => manufactureList.indexOf(val) === idx
    );

    filteredManufactureList.forEach((e) => {
      const manufactureDir = `${dir}/${e}`;
      fs.readdir(manufactureDir, null, (error) => {
        if (error) {
          return fs.mkdirSync(manufactureDir);
        }
      });
    });

    // pdf parsing

    const pdfs = await page.evaluate(() => {
      const result = [];
      Array.from(document.querySelectorAll('tbody tr')).map((v, idx) => {
        // pdf link
        const link = v.querySelector('td:nth-child(5) a').href;

        // part number
        const pn = v.querySelector('.pname').textContent;

        // manufacture
        let mf = v.querySelector('#mfr').textContent.split('/');
        if (mf[1]) {
          mf = `${mf[0].trim()} ${mf[1].trim()}`;
        } else {
          mf = mf[0];
        }
        result.push({ mf: mf, pn: pn, link: link });
      });
      return result;
    });

    // compare pdf & save file

    for (const v of pdfs) {
      const idx = pdfs.indexOf(v);
      const isMatched = await comparePartNumber(browser, v.pn);

      if (v.link.includes('.pdf') || v.link.includes('.PDF')) {
        axios({
          method: 'GET',
          url: v.link,
          responseType: 'arraybuffer',
        })
          .then((res) => {
            let partnumber = v.pn;
            if (v.pn.includes('/')) {
              console.log(`master-crawler 이름 :${v.pn}`);
              partnumber = `이름변경${v.pn.split('/')[0]}`;
            }
            if (isMatched) {
              console.log(
                `download matched pn : ${partnumber}, index : ${idx + 1}, last index : ${
                  pdfs.length
                }`
              );
              fs.writeFileSync(`${dir}/${v.mf}/비교${partnumber}.pdf`, res.data);
            } else {
              console.log(
                `download pn : ${partnumber}, index : ${idx + 1}, last index : ${pdfs.length}`
              );
              fs.writeFileSync(`${dir}/${v.mf}/${partnumber}.pdf`, res.data);
            }
          })
          .catch((err) => {
            console.log('@@@@@@@@@  ERROR @@@@@@@@@');
            console.log('Part number : ', v.pn);
            console.log('@@@@@@@@@  ERROR @@@@@@@@@');
          });
      } else {
        fs.writeFileSync(`${dir}/${v.mf}/${v.pn}.txt`, v.link);
        console.log(`Fail pn : ${v.pn}, index : ${idx}, mf : ${v.mf}, link : ${v.link}`);
      }
    }
  } catch (error) {
    console.log('@@@ catch error @@@');
    console.log(error);
  }
};

// alldatasheet.com 검색 결과를 비교하여 boolean으로 반환
async function comparePartNumber(browser, pn) {
  const page2 = await browser.newPage();
  await page2.goto(`https://www.alldatasheet.com/view.jsp?Searchword=${pn}`);
  await page2.waitForTimeout(1000);

  const isMatched = await page2.evaluate(
    (pn) => {
      if (!document.querySelector('#cell10 td:nth-child(2) a')) {
        return false;
      }
      const mostMatchedPn = document.querySelector('#cell10 td:nth-child(2) a').textContent.trim();
      if (pn === mostMatchedPn) {
        return true;
      } else {
        return false;
      }
    },
    [pn]
  );
  page2.close();
  return new Promise((resolve, reject) => {
    resolve(isMatched);
  });
}

// 제조사 리스트를 분석,배열로 반환
async function parseManufactureList(page) {
  const list = await page.evaluate(() => {
    const name = Array.from(document.querySelectorAll('#mfr')).map((v) => {
      return v.textContent && v.textContent;
    });
    const result = name.map((v) => {
      const mf = v.split('/');
      if (!mf[1]) {
        return mf[0];
      }
      return `${mf[0].trim()} ${mf[1].trim()}`;
    });
    return result;
  });
  return list;
}

// query를 인자로 받아서 검색결과 데이터를 master-crawler로 다운받음

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getInput() {
  let input;
  console.log('Query를 입력하세요');
  rl.on('line', (line) => {
    input = line;
    rl.close();
  }).on('close', () => {
    crawler(input);
  });
}

getInput();

// 1 2 3 4 5 7 8 a h
