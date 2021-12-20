const xl = require("excel4node");
const path = require("path");
const fs = require("fs");

const wb = new xl.Workbook();
const ws = wb.addWorksheet("BEFORE");
const afterWs = wb.addWorksheet("AFTER");

// rev 12.16.2021
// ! INPUT :  바탕화면에서 master_crawler폴더를 찾아서 실행해야합니다. 작업 컴퓨터에서 경로를 변경해주세요
const dirPath = path.join(__dirname, "..", "..", "..", "master_crawler");
const backupPath = path.join(__dirname, "..", "..", "..", "crawling_backup");
fs.readdir(backupPath, (err) => {
  if (err) {
    fs.mkdirSync(backupPath);
  }
});

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

const getFullDir = (dirPath, mfDirs) => {
  const result = [];
  for (const mfDir of mfDirs) {
    const files = fs.readdirSync(`${dirPath}/${mfDir}`);
    if (files[0]) {
      for (f of files) {
        if (f.includes(".pdf") || f.includes(".PDF")) {
          const file = f.slice(0, f.length - 4);
          result.push({ mf: mfDir, pn: file });
        }
      }
    }
  }
  return result;
};

async function saveDirToExcel() {
  try {
    const mfDirs = await getMfDir(dirPath);
    const result = getFullDir(dirPath, mfDirs);
    for (let i = 0; i < result.length; i++) {
      const mf = result[i].mf;
      const pn = result[i].pn;

      // rev 12.16.2021
      //! OUTPUT : 작업 컴퓨터에서 바탕화면 폴더의 경로를 지정해주세요(window)
      const dir = path.join(__dirname, "..", "..", "..");

      ws.cell(i + 1, 1).string(mf);
      ws.cell(i + 1, 2).string(pn);

      afterWs.cell(i + 1, 1).string(mf);
      afterWs.cell(i + 1, 2).string(pn);

      wb.write(`${dir}/crawling_work_sheet.xlsx`);
      wb.write(`${dir}/crawling_backup/crawling_work_sheet.xlsx`);
    }
  } catch (error) {
    console.log(error);
  }
}

saveDirToExcel();
