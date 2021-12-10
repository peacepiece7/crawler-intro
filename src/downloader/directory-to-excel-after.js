const xl = require("excel4node");
const path = require("path");
const fs = require("fs");

// Create a new instance of a Workbook class
const wb = new xl.Workbook();

const ws = wb.addWorksheet("after");
ws.column(1).setWidth(40);
ws.column(2).setWidth(30);
ws.column(3).setWidth(30);

// window 기준으로 작성
const baseUrl = path.join(__dirname, "..", "..", "..", "master-crawler");
// const baseUrl = "./master-crawler-done";

const getMfDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (error, file) => {
      if (error) {
        reject(error);
      } else {
        resolve(file);
      }
    });
  });
};

const getFullDir = (baseUrl, mfDirs) => {
  const result = [];
  for (const mfDir of mfDirs) {
    const files = fs.readdirSync(`${baseUrl}/${mfDir}`);
    if (files[0]) {
      for (f of files) {
        if (f.includes(".pdf") || f.includes(".PDF")) {
          result.push({ mf: mfDir, pn: f });
        }
      }
    }
  }
  return result;
};

async function saveDirToExcel() {
  try {
    const mfDirs = await getMfDir(baseUrl);
    const result = getFullDir(baseUrl, mfDirs);
    for (let i = 0; i < result.length; i++) {
      const el = result[i];
      const partnumber = el.pn.slice(0, el.pn.length - 4);
      // C column
      ws.cell(i + 1, 3).string(partnumber);
      const dir = path.join(__dirname, "..", "..", "..");
      wb.write(`${dir}/pdfToExcelAfter.xlsx`);
    }

    // 각각의 폴더를 돌며 그 안의 pdf파일을 돔
    // [{dir : "TDK", pn : "a123"},{dir : "TDK", pn : "b444"}] 이런 배열을 만듬
  } catch (error) {
    console.log(error);
  }
}

saveDirToExcel();
