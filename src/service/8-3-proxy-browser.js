const puppeteer = require("puppeteer");

// ! 적용 안되는데 이유를 모르곘다...

const cralwer = async () => {
  try {
    // * 가장 빠른 proxy를 선별, db에 저장 후 가저오는 방식
    // * 1. cloud function, lamba로 서버 하나당 browser하나씩 띄워서 진행
    // * 2. 하나의 서버에 여러개의 창을 띄워서 (proxy로) 진행
    // * headless : true시 capcha를 피해갈 수 있음
    const proxies = [{ ip: "94.158.52.152:8088" }, { ip: "105.112.191.250:3128" }, { ip: "185.193.169.246:44380" }];
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1480,1480", "disable-Notifications", `proxy-server=${proxies[0].ip}`],
    });
    const browser2 = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1480,1480", "disable-Notifications", `proxy-server=${proxies[1].ip}`],
    });
    const browser3 = await puppeteer.launch({
      headless: false,
      args: ["--window-size=1480,1480", "disable-Notifications", `proxy-server=${proxies[2].ip}`],
    });

    const page = await browser.newPage();
    const page2 = await browser2.newPage();
    const page3 = await browser3.newPage();

    await page.goto("http://www.whatismyproxy.com/");
    await page2.goto("http://www.whatismyproxy.com/");
    await page3.goto("http://www.whatismyproxy.com/");
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
