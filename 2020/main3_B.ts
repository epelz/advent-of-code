// run with `ts-node main1_A.ts`
const fs = require('fs');
const input = fs.readFileSync('./input3.txt').toString().split("\n").map(l => [...l]);
console.log(input)

const height = input.length;

function checkSlope(right, down) {
  let j = 0;
  let match = 0;
  let skipNext = false;
  for (const row of input) {
    if (row.length === 0) { break; }
    if (skipNext) { skipNext = false; continue; }
    if (down === 2) {
      skipNext = true;
    }

    //  console.log(row, j, row[j], row.length);
    if (row[j] === "#") {
      match++;
    }
    j = (j + right) % row.length;
  }
  console.log("right", right, "down", down, "match", match);
  return match;

}

console.log(checkSlope(1, 1) * checkSlope(3, 1) * checkSlope(5, 1) * checkSlope(7, 1) * checkSlope(1, 2));
