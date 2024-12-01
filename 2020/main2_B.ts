// run with `ts-node main1_A.ts`
const fs = require('fs');
const input = fs.readFileSync('./input2.txt').toString().split("\n").map(l => l.split(" "));
console.log(input)

const matches = input.filter(l => {
  if (l[0] === "") { return; }

  const [low, high] = l[0].split("-").map(n => parseInt(n));
  const letter = l[1].slice(0, -1);
  const passwd = l[2];

  const expanded = [...passwd];

  const numMatches = (expanded[low-1] === letter ? 1 : 0) + (expanded[high-1] === letter ? 1 : 0);

  return numMatches === 1;
});

console.log(matches.length);
