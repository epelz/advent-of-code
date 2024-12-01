// run with `ts-node main1_B.ts`
const fs = require('fs');
const input = fs.readFileSync('./input1.txt').toString().split("\n").map(l => parseInt(l));

input.forEach(n1 => {
  input.forEach(n2 => {
    input.forEach(n3 => {
      if (n1 + n2 + n3 === 2020) { console.log(n1 * n2 * n3); }
    });
  });
});
