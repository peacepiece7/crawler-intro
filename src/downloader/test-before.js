const xl = require("excel4node");
const path = require("path");
const fs = require("fs");

// Create a new instance of a Workbook class
const wb = new xl.Workbook();

const ws = wb.addWorksheet("BEFORE");
const afterWs = wb.addWorksheet("AFTER");
ws.column(1).setWidth(40);
ws.column(2).setWidth(30);
ws.column(3).setWidth(30);

afterWs.column(1).setWidth(40);
afterWs.column(2).setWidth(30);
afterWs.column(3).setWidth(30);

// for window directory
const baseUrl = path.join(__dirname, "..", "master-crawler");

// for mac test directory
// const baseUrl = './master-crawler';

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
          let mf = mfDir;
          if (mf.includes(".")) {
            mf = mfDir.split(".").join("");
          }
          const file = f.slice(0, f.length - 4);
          result.push({ mf: mf, pn: file });
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
      // Manufacture column
      ws.cell(i + 1, 1).string(el.mf);

      afterWs.cell(i + 1, 1).string(el.mf);
      // Origin part number
      ws.cell(i + 1, 2).string(partnumber);
      afterWs.cell(i + 1, 2).string(partnumber);

      // for window directory
      //   const dir = path.join(__dirname, "..", "..", "..");
      // for mac directory (test only)
      const dir = path.join(__dirname, "..", "..");

      wb.write(`${dir}/crawling_work_sheet.xlsx`);
    }
  } catch (error) {
    console.log(error);
  }
}

saveDirToExcel();
