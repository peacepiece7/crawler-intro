//! TEST FILE USED ONLY ON MAC

const xl = require('excel4node');
const path = require('path');
const fs = require('fs');

const wb = new xl.Workbook();
const ws = wb.addWorksheet('BEFORE');
const afterWs = wb.addWorksheet('AFTER');

ws.column(1).setWidth(40);
ws.column(2).setWidth(30);
ws.column(3).setWidth(30);

afterWs.column(1).setWidth(30);
afterWs.column(2).setWidth(30);
afterWs.column(3).setWidth(30);

const baseUrl = path.join(__dirname, '..', '..', '..', 'master_crawler');

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
        if (f.includes('.pdf') || f.includes('.PDF')) {
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
    const mfDirs = await getMfDir(baseUrl);
    const result = getFullDir(baseUrl, mfDirs);

    for (let i = 0; i < result.length - 1; i++) {
      const mf = result[i].mf;
      const pn = result[i].pn;
      const dir = path.join(__dirname, '..', '..', '..');

      ws.cell(i + 1, 1).string(mf);
      ws.cell(i + 1, 2).string(pn);

      afterWs.cell(i + 1, 1).string(mf);
      afterWs.cell(i + 1, 2).string(pn);

      wb.write(`${dir}/crawling_work_sheet.xlsx`);
    }
  } catch (error) {
    console.log(error);
  }
}

saveDirToExcel();
