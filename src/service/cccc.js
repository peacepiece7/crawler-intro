const { forEach } = require("lodash");

const str = [11, 22, 33, 44, 55, 66];

const ch = () => {
  const done = str.forEach((v, idx) => {
    setTimeout(() => {
      console.log(v);
    }, 500 * idx);
    return "TRUE";
  });
  console.log(done);
};

ch();

const stra = [11, 22, 33, 44, 55, 66];
function ca() {
  return new Promise((res, rej) => {
    stra.forEach((v, idx) => {
      setTimeout(res, 2000).then(() => {
        console.log(v);
      });
    });
  });
}
ca();

const cd = async () => {
  const done = await function () {
    console.log("AAA");
    return "AAAAA";
  };
};????????????????????????????????????????????????????

// 하고싶은 코드 
str.forEach((v, idx) => {
    await v.click()
}, idx * 300).then(() => {
    await page.evaluate(() => { // .... dom control 
    })
})
