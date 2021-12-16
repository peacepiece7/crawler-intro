// Promise 선언
const promise = new Promise((resolve, reject) => {
  if (condition) {
    resolve("promise success");
  }
  reject("promise failure");
});

// resolve, reject만 있을 경우
const successPromise = Promise.resolve("only success");
const failurePromise = Promise.reject("only failure");

// promise 동시 실행
Promise.all({ promise, promise, promise })
  .then((result) => {})
  .catch((error) => {});

User.findOne("zero", (err, user) => {
  console.log(user);
});

const zero = User.findeOne("zero");

// ..... 엄청 긴 로직

zero.then((zero) => {
  console.log(zero);
});
