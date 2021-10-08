const axios = require("axios");
const cheerio = require("cheerio");
const parse = require("csv-parse/lib/sync");
const fs = require("fs");

// item_name
// item_price
const str = fs.readFileSync("src/assets/csv/gsc.csv").toString("utf-8");
const records = parse(str);

const crawler = async () => {
  for (const [idx, record] of Object.entries(records)) {
    const address = record[2];
    const response = await axios.get(address);
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      const names = $(".item_name").text();
      const prices = $(".item_price").text();
      const name = names.split(/\[/g);
      console.log(prices.replace(/s*/g, ""));
      console.log(name);
      console.log(prices.split(/\r?\n/gi));
    } else {
      console.log("ㅠㅠ");
    }
  }
};
crawler();
