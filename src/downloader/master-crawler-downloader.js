// ! 작업 환경에 맞게 디렉토리와 mouse helper를 수정해야 합니다.

const puppeteer = require("puppeteer");
const fs = require("fs");
const { installMouseHelper } = require("../service/install-mouse-helper");
const axios = require("axios");
const readline = require("readline");
const path = require("path");

// rev 12.16.2021

const dir = path.join(__dirname, "..", "..", "..", "master_crawler");
// Craete master_crawler folder
fs.readdir(dir, null, (err) => {
  if (err) {
    fs.mkdirSync(dir);
  }
});

const crawler = async (query) => {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size:1720,1400"],
    });
    await browser.userAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36"
    );
    let page = await browser.newPage();
    await page.setViewport({
      width: 1520,
      height: 1280,
    });
    await installMouseHelper(page);
    await page.goto(`http://115.22.68.60/master/crawl/index.jsp?pre=${query}`, {
      waitUntil: "networkidle0",
    });

    // mouse helper for window
    await page.mouse.move(210, 85);
    await page.waitForTimeout(1000);
    await page.mouse.click(210, 85);
    await page.waitForTimeout(2000);

    const manufactureList = await parseManufactureList(page);
    const filteredManufactureList = manufactureList.filter((val, idx) => manufactureList.indexOf(val) === idx);

    // 제조사 폴더 생성
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
      if (document.querySelector("tbody tr td")) {
        Array.from(document.querySelectorAll("tbody tr")).map((v, idx) => {
          const pdfLink = v.querySelector("td:nth-child(5) a").href;
          const pn = v.querySelector(".pname").textContent;
          let mf = v.querySelector("#mfr").textContent.split("/");

          if (mf.includes(".")) {
            mf.split(".").join("");
          }
          if (mf[1]) {
            mf = `${mf[0].trim()} ${mf[1].trim()}`;
          } else {
            mf = mf[0];
          }
          result.push({ mf: mf, pn: pn, link: pdfLink });
        });
      }
      return result;
    });

    // compare pdf & save file
    for (const v of pdfs) {
      const idx = pdfs.indexOf(v);

      const isMatched = await comparePartNumber(browser, v.pn);

      if (v.link.includes(".pdf") || v.link.includes(".PDF")) {
        axios({
          method: "GET",
          url: v.link,
          responseType: "arraybuffer",
        })
          .then((res) => {
            let pn = v.pn;
            if (pn.includes("/")) {
              pn = `modified${v.pn.split("/")[0]}`;
            }
            if (pn.includes(".")) {
              pn = `modified${v.pn.split(".")[0]}`;
            }
            if (isMatched) {
              console.log(`다운로드: ${pn}/${v.mf}, 인덱스: ${idx + 1}, 마지막 인덱스: ${pdfs.length}`);
              fs.writeFileSync(`${dir}/${v.mf}/exsisting${pn}.pdf`, res.data);
            } else {
              console.log(`다운로드: ${v.pn}/${v.mf}, 인덱스: ${idx + 1}, 마지막 인덱스: ${pdfs.length}`);
              fs.writeFileSync(`${dir}/${v.mf}/${pn}.pdf`, res.data);
            }
          })
          .catch((error) => {
            console.log("@@@@@@@@@  ERROR @@@@@@@@@");
            console.log(error);
            console.log("pn : ", v.pn);
          });
      } else {
        fs.writeFileSync(`${dir}/${v.mf}/${pn}.txt`, v.link);
        // prettier-ignore
        // console.log(`Download failure, 파트넘버 : ${v.pn}, 인덱스 : ${idx}, 제조사 : ${v.mf} @@`);
        // console.log(`${v.pn}.pdf파일이 존재하지 않습니다. 아래 링크에서 확인해주세요`);
        // console.log(v.link);
      }
    }
    await page.waitForTimeout(2000);
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@                                                                                      @");
    console.log("@                    다운로드가 끝났습니다. 아래 공지를 학인해주세요                   @");
    console.log("@                                                                                      @");
    console.log('@   1. "modified" or "exsisting"라고 파트넘버 앞에 붙어 있다면 확인 후 진행해주세요.   @');
    console.log("@ 2. .txt 파일로 저장된 경우 pdf파일이 존재하지 않는 경로입니다. 확인 후 진행해주세요. @");
    console.log("@                                                                                      @");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  } catch (error) {
    console.error(error);
  }
};

// 두 번째 인자를 alldatasheet.com에 검색 불리언으로 반환
async function comparePartNumber(browser, pn) {
  const page2 = await browser.newPage();
  await page2.goto(`https://www.alldatasheet.com/view.jsp?Searchword=${pn}`);
  await page2.waitForTimeout(1000);

  const isMatched = await page2.evaluate(
    (pn) => {
      if (!document.querySelector("#cell10 td:nth-child(2) a")) {
        return false;
      }
      const mostMatchedPn = document.querySelector("#cell10 td:nth-child(2) a").textContent.trim();
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
  try {
    const list = await page.evaluate(() => {
      if (document.querySelector("#mfr")) {
        const name = Array.from(document.querySelectorAll("#mfr")).map((v) => {
          return v.textContent && v.textContent;
        });
        const result = name.map((v) => {
          let mf = v;
          if (v.includes(".")) {
            mf = v.split(".").join("");
          }
          if (v.includes("/")) {
            mf = v.split("/");
          }
          if (typeof mf === "string") {
            return mf;
          }
          return `${mf[0].trim()} ${mf[1].trim()}`;
        });
        return result;
      }
    });
    return list;
  } catch (error) {
    console.log("can`t find manufacture list");
    console.log(error);
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getInput() {
  let input;
  console.log("Query를 입력하세요");
  rl.on("line", (line) => {
    input = line;
    rl.close();
  }).on("close", () => {
    crawler(input);
  });
}

getInput();
