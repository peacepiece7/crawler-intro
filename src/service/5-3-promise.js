class FirebaseDatabase {
  getData(user, result) {
    if (user) {
      result(user);
    } else {
      result(null);
    }
  }
  createData(name, age) {
    return { name: name, age: age };
  }
}

const fireBD = new FirebaseDatabase();

const promise = new Promise((resolve, reject) => {
  fireBD.getData("taetae", (result) => {
    if (result) {
      resolve(result);
    } else {
      reject(result);
    }
  });
});

// * promise.then().catch()
// prettier-ignore
promise
.then((res) => console.log(res))
.catch((err) => console.log(err));

// * Promise.all([]).then().catch() ..  callback은 라이브러리 안쓰면 힘듬
// prettier-ignore
Promise.all([fireBD.createData("taetae", 28), fireBD.createData("john", 33)])
.then((res) => {
  console.log(res);
}).catch((err) => { console.log(err)})
