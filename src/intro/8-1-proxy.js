const puppeteer = require("puppeteer");

const cralwer = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false, args: ["--window-size=1480,1480"], defaultViewport: { width: 1280, height: 1280 } });
    // await browser.userAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36");
    let page = await browser.newPage();
    // page.setViewport({
    //   width: 1080,
    //   height: 1080,
    // });
    await page.goto("https://spys.one/en/free-proxy-list/");

    const proxies = await page.evaluate(() => {
      const ips = [...document.querySelectorAll(".spy14:first-child .spy2")].map((element) => {
        return element.parentNode.textContent.replace(/document\.write\(.+\)/, "");
      });
      const types = [...document.querySelectorAll("tr td:nth-of-type(2)")]
        .filter((v, i) => {
          if (i > 2) {
            return v;
          }
        })
        .map((v) => {
          return v.textContent;
        });
      const latencies = Array.from(document.querySelectorAll("tr td:nth-of-type(6) .spy1")).map((element) => {
        return element.textContent;
      });

      return ips.map((value, idx) => {
        return {
          ip: value,
          type: types[idx],
          latency: latencies[idx],
        };
      });
    });

    const filtered = proxies.filter((value) => value.type.split(" ")[0] === "HTTP").sort((pre, cur) => pre.latency - cur.latency);
    // await page.setJavaScriptEnabled(false);
    // page.setDefaultNavigationTimeout(20000);

    await page.close();
    await browser.close();
    await page.waitForTimeout(2000);
    console.log(filtered[0].ip);
    browser = await puppeteer.launch({ headless: false, args: ["--window-size:1280,1280", "--ignore-certificate-errors"`--proxy-server=http://${filtered[0].ip}`] });

    page = await browser.newPage();
    await page.goto("http://www.whatismyproxy.com/");
  } catch (err) {
    console.log(err);
  }
};

cralwer();

// SOCKS5 = Deep web browser header
// HIA = High Annonimity
// NOA = Not of Annonimity

// https://spys.one/en/free-proxy-list/
// postman으로 보냈을 떄, 페이지 정보가 잘 나오면 크롤링하기 쉬운 사이트
