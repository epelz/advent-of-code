// run with `ts-node main1_A.ts`
const fs = require('fs');
const input = fs.readFileSync('./input3.txt').toString().split("\n").map(l => [...l]);
console.log(input)

const height = input.length;

let j = 0;
let match = 0;
for (const row of input) {
  if (row.length === 0) { break; }

  //  console.log(row, j, row[j], row.length);
  if (row[j] === "#") {
    match++;
  }
  j = (j + 3) % row.length;
}
console.log(match);
