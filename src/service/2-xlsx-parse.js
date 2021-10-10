const xlsx = require("xlsx");

const workbook = xlsx.readFile("src/data/xlsx/coffee_data.xlsx");

console.log(workbook.SheetNames);
for (const name of workbook.SheetNames) {
  const ws = workbook.Sheets[name];
  // ... parse sheets
}

const ws = workbook.Sheets.커피리스트;

// * 특정 범위를 파싱하기
// 잘하는 척 하기
ws["!ref"] = ws["!ref"]
  .split(":")
  .map((v, i) => {
    if (i === 0) {
      return "A2";
    }
    return v;
  })
  .join(":");

// * header 옵션을 주면 데이터에 키가 추가 됨
const records = xlsx.utils.sheet_to_json(ws, { header: "A" });
console.log(records);

// * records.entries() === Object.entries(records) 객채 배열을 이터러블 배열로 반환
records.forEach((r, i) => {
  console.log(r.커피, r.가격, r.주소);
});

for (const [i, r] of Object.entries(records)) {
  console.log(i, r.커피, r.가격, r.주소);
}
