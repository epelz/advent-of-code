// run with `ts-node main1_A.ts`
const fs = require('fs');
const input = fs.readFileSync('./input4.txt').toString().split("\n\n").map(l => l.split(/\n| /).map(kv => kv.split(":")[0]));
console.log(input)

const expectedKeys =["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]; //, "cid"];
const numMatch = input.filter(keys => {
  return (expectedKeys.filter(k => keys.indexOf(k) !== -1).length === expectedKeys.length);
}).length;
console.log(numMatch)
