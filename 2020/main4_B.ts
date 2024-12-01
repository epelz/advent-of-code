// run with `ts-node main1_A.ts`
const fs = require('fs');
const input = fs.readFileSync('./input4.txt').toString().split("\n\n").map(l => l.split(/\n| /));
console.log(input)

function yrValidate(value, minV, maxV) {
  return (value.length === 4 && (parseInt(value) >= minV) && (parseInt(value) <=  maxV));
}

const ret = input.filter(passport => {
  let numValidated = 0;
  passport.forEach(kv => {
    const [key, value] = kv.split(":");
    switch(key) {
      case "byr":
        if (yrValidate(value, 1920, 2002)) { numValidated++; }
        return;
      case "iyr":
        if (yrValidate(value, 2010, 2020)) { numValidated++; }
        return;
      case "eyr":
        if (yrValidate(value, 2020, 2030)) { numValidated++; }
        return;
      case "hgt":
        const unit = value.slice(-2);
        const val = value.slice(0, -2);
        if (unit === "cm") {
          if (val >= 150 && val <= 193) { numValidated++; }
        } else if (unit === "in") {
          if (val >= 59 && val <= 76) { numValidated++; }
        }
        return;
      case "hcl":
        if (value.match(/^#([0-9]|[a-f]){6}$/) !== null) { numValidated++; }
        return;
      case "ecl":
        if (["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].indexOf(value) !== -1) { numValidated++; }
        return;
      case "pid":
        if (value.length === 9) { numValidated++; }
        return;
      case "cid":
        // ignored
        return;
    }
  })

  console.log(numValidated)
  return (numValidated === 7);
});

console.log(ret.length);

//const expectedKeys =["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]; //, "cid"];
//const numMatch = input.filter(keys => {
//  return (expectedKeys.filter(k => keys.indexOf(k) !== -1).length === expectedKeys.length);
//}).length;
//console.log(numMatch)
