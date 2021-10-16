const fs = require("fs");

const testFunc = () => {
  fs.readFile("src/coffee_assets/tmp/parse_location/gsc_parse_location.csv", (err, file) => {
    if (err) {
      fs.writeFileSync("src/coffee_assets/tmp/parse_location/gsc_parse_location.csv", "");
    }
  });
};

testFunc();
