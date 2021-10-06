import parse from "csv-parse/lib/sync";
import fs from "fs";

console.log(__dirname, " <- __direname");
const csv = fs.readFileSync("src/data/csv/coffee_data.csv");

// fs로 읽어오는 데이터는 기본적으로 buffer (0,1)임
const recodes = parse(csv.toString("utf-8"));

recodes.forEach((r, i) => {
  console.log(i, r);
});
