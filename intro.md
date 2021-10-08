# Crawler

# CSV Parsing

### CSV

[scv-parse npm](https://www.npmjs.com/package/csv-parse)

The source code uses modern JavaScript features and run natively in Node 7.6+. For older browsers or older versions of Node, use the modules inside "./lib/es5", i.e. require("csv-parse") will become **require("csv-parse/lib/es5").**

.csv로 사용

Comma Seperated Value

for instance

```
에티오피아 테스트 G1,22000원,에티오피아,https://www.gsc.com
에티오피아 테스트 G1,22000원,에티오피아,https://www.gsc.com
에티오피아 테스트 G1,22000원,에티오피아,https://www.gsc.com
```

### scv-parse

`const parse = require("svc-parse/lib/sync")`

# puppeteer

- method demo
  (try-puppeteer)[https://try-puppeteer.appspot.com/]

### headless option

browser를 띄우지 않고 작업 할 경우 headeless : true (default)로 실행

개발 시 눈으로 봐야 하기 때문에 headless : false로 설정.

sever도 cli로 작업하는 것과 비슷함

```js
puppeteer.launch({ headless: true });
// .env에 NODE_ENV 설정 하고 아래와 같이 작성
puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
```

### page.evaluate

jquery를 사용해서 parse할 경우 아래와 같이 작성할 수 있음

```js
const records;
const crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({ headless: process.env.NODE_ENV === "production" });
    await Promise.all(
      records.map(async (r, i) => {
        try {
          const page = await browser.newPage();
          const scoreEl = await page.$(".score.score_lest .star_score");
          const scoreEl2 = await page.$(".score.score_lest .star_score");
          const scoreEl3 = await page.$(".score.score_lest .star_score");
          if (scoreEl) {
            const text = await page.evaluate((tag) => {
              return tag.textContent;
            });
            result[i] = [r[0], r[1], text.trim()];
          }
          if (scoreEl2) {
            const text = await page.evaluate((tag) => {
              return tag.textContent;
            });
            result[i] = [r[0], r[1], text.trim()];
          }

          if (scoreEl3) {
            const text = await page.evaluate((tag) => {
              return tag.textContent;
            });
            result[i] = [r[0], r[1], text.trim()];
          }
        } catch (e) {
          consple.log(e);
        }
      }),
    );
  } catch (e) {
    console.log(e);
  }
};
```

태그가 많아질수록 로직이 지저분 해지기 떄문에 아래와 같이 작성할 수 있음

아래 두 박스는 같은 코드

```js
await Promise.all(
  records.map(async (r, i) => {
    try {
      const page = await browser.newPage();
      await page.goto(r[i]);

      const result = await page.evaluate(() => {
        const score = document.querySelector(".score.score_left .star_score");
        if (score) {
          return { score: score.textContent };
        }
        await page.waitFor(3000);
        await page.close();
      });
      result[i] = [r[0], r[1], result];
    } catch (error) {
      console.log(error);
    }
  }),
);
```

```js
await Promise.all(
  records.map(async (r, i) => {
    try {
      const page = await browser.newPage();
      await page.goto(r[i]);

      const text = await page.evaluate(() => {
        const score = document.querySelector(".score.score_left .star_score");
        if (score) {
          result[i] = [r[0], r[1], score.textContet.trim()];
        }
        await page.waitFor(3000);
        await page.close();
      });
    } catch (error) {
      console.log(error);
    }
  }),
);
```

evaluate callback안에서는 dom api를 쓸 수 있기 떄문에, 여기에서 parse대상을 선택하는게 코드가 더 깔끔함

# userAgent

axios, setUserAgent로 navigator.userAgent 변경, postman도 userAgent 변경해줘야함

- 서버를 여러개 만들기, (cloud, aws.. )
- waitFor(ms)로 ms 조절
