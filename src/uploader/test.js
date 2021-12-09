const e = require("express");
const fs = require("fs");
const path = require("path");
const dir = path.join("..", "master-crawler-done");

fs.readdir(dir, (err, file) => {
  if (err) {
    console.log(err);
  } else {
    for (f of file) {
      console.log(fs.readdirSync(`${dir}/${f}`));
    }
  }
});
