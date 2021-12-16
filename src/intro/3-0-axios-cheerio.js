const xlsx = require("xlsx");
const axios = require("axios");
const cheerio = require("cheerio");

const workbook = xlsx.readFile("src/assets/xlsx/movie_list.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

// cheerio-axios조합은 간단한 페이지만 가능.
const crawler = async () => {
  // * for of 문은 순서를 보장해 주지만 속도가 느림, trade off
  for (const [i, r] of records.entries()) {
    const response = await axios.get(r.주소);
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      // jquery api 사용가능 (원래는 textContent, innerHtml ..  dom api)
      // jQuery 사용, text() = innerText || textContent, html() = innerHTML
      const text = $(".score.score_left .star_score").text();
      console.log(r.영화제목, "평점", text.trim());
    }
  }

  // * Promise.all은 순서가 보장되지 않지만 빠름, trade off
  await Promise.all(
    records.map(async (r) => {
      const response = await axios.get(r.주소);
      if (response.status === 200) {
        const html = response.data;
        const $ = cheerio.load(html);
        // jquery api 사용가능 (원래는 textContent, innerHtml ..  dom api)
        // jQuery 사용, text() = innerText || textContent, html() = innerHTML
        const text = $(".score.score_left .star_score").text();
        console.log(r.영화제목, "평점", text.trim());
      }
    }),
  );
};

crawler();

// excel write part는 회사에서 하기..
// CSR은 js가 content를 만들어 주기 때문에, html이 텅 비어있어서 axiox + cheerio는 불가.
