// ——— 1) 맵 정보 정의 ———
const ladders = {
  4: 14,
  8: 30,
  21: 42,
  28: 76,
  50: 67,
  71: 92,
  80: 99,
};

const snakes = {
  32: 10,
  36: 6,
  48: 26,
  62: 18,
  88: 24,
  95: 56,
  97: 78,
};

// ——— 2) 처리 함수 분리 ———
function applyLadder(pos) {
  return ladders[pos] ?? pos;
}

function applySnake(pos) {
  return snakes[pos] ?? pos;
}

// ——— 3) 최종 위치 계산 함수 ———
function nextPosition(current, dice) {
  const raw = current + dice; // 주사위만큼 이동
  const afterLadder = applyLadder(raw); // 사다리 타면 위로
  const afterSnake = applySnake(afterLadder); // 뱀에 물리면 아래로
  return afterSnake;
}

// ——— 4) 사다리 기능 검증 ———
const ladderTests = [
  { dice: 4, expected: 14 },
  { dice: 8, expected: 30 },
  { dice: 21, expected: 42 },
  { dice: 28, expected: 76 },
  { dice: 50, expected: 67 },
  { dice: 71, expected: 92 },
  { dice: 80, expected: 99 },
];

console.log("사다리 기능 검증:");
for (const { dice, expected } of ladderTests) {
  const result = nextPosition(0, dice);
  const pass = result === expected ? "✅" : "❌";
  console.log(`${pass} dice=$   {dice} → next=${result} (기댓값 ${expected})`);
}

const snakeTests = [
  { dice: 32, expected: 10 },
  { dice: 36, expected: 6 },
  { dice: 48, expected: 26 },
  { dice: 62, expected: 18 },
  { dice: 88, expected: 24 },
  { dice: 95, expected: 56 },
  { dice: 97, expected: 78 },
];

console.log("\n뱀 기능 검증:");
for (const { dice, expected } of snakeTests) {
  const result = nextPosition(0, dice);
  const pass = result === expected ? "✅" : "❌";
  console.log(`${pass} dice=${dice} → next=${result} (기댓값 ${expected})`);
}

console.log("\n▶게임 시뮬레이션:");
let current = 1;
const rolls = [3, 4, 3, 5, 1]; 
for (const dice of rolls) {
  const next = nextPosition(current, dice);
  console.log(`from=${current} , dice=${dice} , next=${next}`);
  current = next;
}
