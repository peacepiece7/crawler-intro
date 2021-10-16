const puppeteer = require("puppeteer");

const getProxyIp = async () => {
  try {
    let browser = await puppeteer.launch({ headless: false, args: ["--window-size=1280,1080"], defaultViewport: { width: 900, height: 1080 } });
    await browser.userAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36",
    );
    let page = await browser.newPage();
    await page.goto("https://spys.one/en/free-proxy-list/");

    const proxies = await page.evaluate(() => {
      // 리스트 500개로 변경하기
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
    const filtered = proxies.filter((value) => value.type.split(" ")[0] === "HTTPS").sort((pre, cur) => pre.latency - cur.latency);
    await page.close();
    await browser.close();

    await page.waitForTimeout(2000);
    console.log(filtered[0].ip);
    return filtered[0].ip;
  } catch (err) {
    console.log(err);
  }
};

getProxyIp();

// * GSC site parsing
// gsc path를 가져옴
// gsc,https://www.gsc.coffee/goods/goods_list.php?page=2&cateCd=001
// { ip: '188.166.242.197:3128', type: 'HTTP', latency: '0.737' },
// 176.74.150.34:8080
// 198.144.149.82:3128
// 185.239.105.211:3128
// `--proxy-server=176.74.150.34:8080`
