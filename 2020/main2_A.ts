// run with `ts-node main1_A.ts`
const fs = require('fs');
const input = fs.readFileSync('./input2.txt').toString().split("\n").map(l => l.split(" "));
console.log(input)

const matches = input.filter(l => {
  if (l[0] === "") { return; }

  const [low, high] = l[0].split("-");
  const letter = l[1].slice(0, -1);
  const passwd = l[2];

  console.log(low, high, letter, passwd);
  const numMatches = [...passwd].filter(c => c === letter).length;

  return numMatches >= low && numMatches <= high;
});

console.log(matches.length);
