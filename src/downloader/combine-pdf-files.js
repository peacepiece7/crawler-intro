const path = require("path");
const fs = require("fs");

const folderDir = path.join(__dirname, "..", "..", "..", "master_crawler");

fs.readdir(folderDir, (error, dirs) => {
  if (error) {
    console.error(error);
  }
  for (let dir of dirs) {
    fs.readdir(`${folderDir}/${dir}`, (error, files) => {
      if (!error) {
        for (let i = 0; i < files.length; i++) {
          if (
            files[i].includes(".pdf") ||
            files[i].includes(".PDF") ||
            files[i].includes(".gif") ||
            files[i].includes(".GIF") ||
            files[i].includes(".tgz") ||
            files[i].includes(".TGZ")
          ) {
            const fileName = files[i].slice(0, files[i].length - 4);
            const format = files[i].split(".")[1];
            fs.rename(`${folderDir}/${dir}/${fileName}.${format}`, `${folderDir}/${fileName}.${format}`, (error) => {
              if (error) {
                console.error(error);
              }
            });
          }
        }
      }
    });
  }
});
