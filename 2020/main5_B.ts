// run with `ts-node main1_A.ts`
const fs = require('fs');
const input = fs.readFileSync('./input5.txt').toString().split("\n");
console.log(input)

const ids = input.map(code => {
  if (code === "") { return -1; }
  const row = parseInt(code.slice(0, 7).replace(/F/g, "0").replace(/B/g, "1"), 2);
  const seat = parseInt(code.slice(7).replace(/L/g, "0").replace(/R/g, "1"), 2);
  const id = row * 8 + seat;
  console.log(code, row, seat, id)
  return [code, id];
});

ids.sort((a,b) => a[1] - b[1]);

const questionable = [];
for (let i = 1; i < ids.length - 1; i++) {
  if (ids[i-1][1] + 1 !== ids[i][1] || ids[i][1] + 1 !== ids[i+1][1]) {
    questionable.push(ids[i]);
    console.log(ids[i], ids[i-1][1], ids[i][1], ids[i+1][1])
  }
}

//const expectedKeys =["byr", "iyr", "eyr", "hgt", "hcl", "ecl", "pid"]; //, "cid"];
//const numMatch = input.filter(keys => {
//  return (expectedKeys.filter(k => keys.indexOf(k) !== -1).length === expectedKeys.length);
//}).length;
//console.log(numMatch)
