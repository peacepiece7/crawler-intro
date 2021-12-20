const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

const excelDir = path.join(__dirname, "..", "..", "..", "crawling_work_sheet.xlsx");
const folderDir = path.join(__dirname, "..", "..", "..", "master_crawler");

const wb = xlsx.readFile(excelDir);
const ws = wb.Sheets.AFTER;

const wsList = xlsx.utils.sheet_to_json(ws, { header: "A" });

fs.readdir(folderDir, (error, files) => {
  if (!error) {
    for (let file of files) {
      if (
        file.includes(".pdf") ||
        file.includes(".PDF") ||
        file.includes(".gif") ||
        file.includes(".GIF") ||
        file.includes(".tgz") ||
        file.includes(".TGZ")
      ) {
        for (let i = 0; i < wsList.length; i++) {
          const fileName = file.slice(0, file.length - 4);
          const format = file.split(".")[1];
          const cellC = wsList[i]["C"];
          const cellA = wsList[i]["A"];
          // type이 다름
          if (fileName == cellC) {
            fs.rename(`${folderDir}/${fileName}.${format}`, `${folderDir}/${cellA}/${fileName}.${format}`, (error) => {
              if (error) {
                console.error(error);
              }
            });
          }
        }
      }
    }
  }
});
