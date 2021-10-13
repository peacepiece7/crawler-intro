// ECMA 2017 async await (generator, go,, semi cortin?)

class FirebaseDatabase {
  getData(user) {
    if (user) {
      return user;
    }
  }
  createData(name, age) {
    for (i = 0; i <= 10000000; i++) {}
    if (name && age) {
      return { name: name, age: age };
    }
  }
}

const fbDB = new FirebaseDatabase();

// * EMCA 2015 promise
const promise = new Promise((resolve, reject) => {
  const data = fbDB.createData("taetae", 29);
  if (data) {
    resolve(data);
  } else {
    reject("failure!");
  }
});

promise
  .then((data) => {
    return fbDB.getData(data);
  })
  .then((user) => {
    console.log("user data is", user);
  })
  .catch((err) => {
    console.log(err);
  });

// * ECAM 2017 async await
async function getUserData(userName, age) {
  try {
    const data = await fbDB.createData(userName, age);
    const user = await fbDB.getData(data);
    console.log(user);
  } catch (err) {
    console.log(err);
    console.log("failure!");
  }
}

getUserData("John", 44);
