const datauri = require("datauri");
const fs = require("fs");
const Buffer = require("buffer");

async function getData() {
  try {
    const content = await datauri("src/assets/tmp/pdf/859.pdf");

    const input = new Buffer(content);
    const compressed = zlib.deflate(input);
    fs.writeFileSync("src/assets/tmp/pdf/content.html", compressed);
    // const output = zlib.inflate(compressed);
  } catch (error) {
    console.log(error);
  }
}

getData();
