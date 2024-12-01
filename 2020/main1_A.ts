// run with `ts-node main1_A.ts`
const fs = require('fs');
const input = fs.readFileSync('./input1.txt').toString().split("\n").map(l => parseInt(l));
console.log(input)

input.forEach(n1 => {
  input.forEach(n2 => {
    if (n1 + n2 === 2020) { console.log(n1 * n2); }
  });
});
