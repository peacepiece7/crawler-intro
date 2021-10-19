const partNumbers = [1111312521, 43453513, 33322, 11535234];

partNumbers.forEach((v, index) => {
  setTimeout(() => {
    const text = `C:\\Users\\INTERBIRD\\Desktop\\tar\\${v}.tgz`;
    console.log(text);
  }, 1000 * index);
});
