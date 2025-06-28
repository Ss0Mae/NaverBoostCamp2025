function play(cards) {
  if (cards.length % 3 !== 0) {
    return new Map([
      ["A", 0],
      ["B", 0],
      ["C", 0],
    ]);
  }

  const lines = [[10], [30], [50], [80]];
  const penalty = { A: 0, B: 0, C: 0 };
  const players = ["A", "B", "C"];

  for (let i = 0; i < cards.length; i += 3) {
    const round = cards.slice(i, i + 3);
    const sorted = round
      .map((v, j) => [v, players[j]])
      .sort((a, b) => a[0] - b[0]);

    for (const [x, p] of sorted) {
      let target = 0,
        minDiff = Infinity;
      for (let idx = 0; idx < 4; idx++) {
        const line = lines[idx];
        if (line.length === 0) continue;
        const last = line.at(-1);
        const diff = Math.abs(last - x);
        if (
          diff < minDiff ||
          (diff === minDiff && last > lines[target].at(-1))
        ) {
          minDiff = diff;
          target = idx;
        }
      }
      const lastVal = lines[target].at(-1);
      if (lastVal > x) {
        lines[target].push(x);
      } else {
        penalty[p] += lines[target].length;
        lines[target] = [];
      }
    }
  }

  return new Map(Object.entries(penalty).map(([k, v]) => [k, String(v)]));
}

// 예시1: [21,9,4]
let result = play([21, 9, 4]);
console.log(`Map(${JSON.stringify([...result])})`);

// 예시2: [55,8,29,13,7,61]
result = play([55, 8, 29, 13, 7, 61]);
console.log(`Map(${JSON.stringify([...result])})`);
