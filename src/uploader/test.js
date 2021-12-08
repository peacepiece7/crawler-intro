const arr = [1, 2, 3, 4, 5];

arr.map((v, idx) => {
  setTimeout(() => {
    console.log(v);
  }, 1000 * idx);
});
