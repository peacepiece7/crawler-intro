const arr = ["A", "B", "C", "D", "E"];

const delay = (v) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(v);
    }, 1000);
  });
};

const func = async () => {
  for (const val of arr) {
    const element = await delay(val);
    console.log(element);
  }
};

func();
