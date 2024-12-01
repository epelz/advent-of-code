// run with `ts-node main1_A.ts`
const fs = require('fs');
const input = fs.readFileSync('./input6.txt').toString().split("\n\n").map(l => l.split("\n"));
console.log(input)

const amounts = input.map(group => {
  const yesQuestions = Array.from(new Set(group.join("").split("")));
  console.log(yesQuestions);
  return yesQuestions.length;
})

console.log(amounts.reduce((a,b) => a+b ));
  /**
const ids = input.map(code => {
  if (code === "") { return -1; }
  const row = parseInt(code.slice(0, 7).replace(/F/g, "0").replace(/B/g, "1"), 2);
  const seat = parseInt(code.slice(7).replace(/L/g, "0").replace(/R/g, "1"), 2);
  const id = row * 8 + seat;
  console.log(code, row, seat, id)
  return id;
});

console.log(Math.max(...ids))
   */
