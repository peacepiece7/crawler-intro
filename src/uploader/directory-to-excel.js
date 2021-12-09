const xlsx = require("xlsx");
const xl = require("excel4node");

const path = require("path");
const fs = require("fs");

const baseUrl = path.join("..", "master-crawler-done");

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
  return new Promise((resolve, reject) => {
    const result = [];
    for (const mfDir of mfDirs) {
      fs.readdir(`${baseUrl}/${mfDir}`, (error, file) => {
        // if (error) {
        //   console.log(error);
        //   return;
        // }
        if (file.includes(".pdf")) {
          result.push({ mf: mfDir, pn: file });
        }
      });
    }
    resolve(result);
  });
};

async function saveDirToExcel() {
  try {
    const mfDirs = await getMfDir(baseUrl);
    const result = getFullDir(baseUrl, mfDirs);
    console.log(result);

    // 각각의 폴더를 돌며 그 안의 pdf파일을 돔
    // [{dir : "TDK", pn : "a123"},{dir : "TDK", pn : "b444"}] 이런 배열을 만듬
  } catch (error) {
    console.log(error);
  }
}

saveDirToExcel();
