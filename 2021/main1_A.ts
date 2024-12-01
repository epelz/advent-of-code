// run with `ts-node main1_A.ts`
const fs = require('fs');
const input = fs.readFileSync('./input1.txt').toString().split("\n").map(l => parseInt(l)).filter(l => !isNaN(l));
console.log(input)

let numIncreases = 0;
input.forEach((n1, idx) => {
  if (idx === 0) {
    return;
  }
  if (input[idx] > input[idx-1]) {
    numIncreases++;
  }
  // input.forEach(n2 => {
  //   if (n1 + n2 === 2020) { console.log(n1 * n2); }
  // });
});
console.log(numIncreases);
