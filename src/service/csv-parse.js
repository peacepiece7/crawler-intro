const parse = require("csv-parse/lib/sync");
const fs = require("fs");

const csv = fs.readFileSync("src/data/csv/coffee_data.csv").toString("utf-8");
const records = parse(csv);

records.forEach((r, i) => {
  console.log(i, r);
});
