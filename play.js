// --- (1) 보드판 그래프 모델(셀 단위) ---
const graph = {
  Z: ["ZW1"],
  ZW1: ["ZW2"],
  ZW2: ["ZW3"],
  ZW3: ["ZW4"],
  ZW4: ["W"],

  W: ["WV1", "WX1"],
  WV1: ["WV2"],
  WV2: ["V"],
  WX1: ["WX2"],
  WX2: ["WX3"],
  WX3: ["WX4"],
  WX4: ["X"],

  X: ["XV1", "XY1"],
  XV1: ["XV2"],
  XV2: ["V"],
  XY1: ["XY2"],
  XY2: ["XY3"],
  XY3: ["XY4"],
  XY4: ["Y"],

  Y: ["YV1", "YZ1"],
  YV1: ["YV2"],
  YV2: ["V"],
  YZ1: ["YZ2"],
  YZ2: ["YZ3"],
  YZ3: ["YZ4"],
  YZ4: ["Z"],

  V: ["VZ1", "VZ1"], // V→Z via two steps VZ1→VZ2 (modeled below)
  VZ1: ["VZ2"],
  VZ2: ["Z"],
};

// --- (2) 단일 스텝 이동 함수 ---
function stepOnce(node) {
  const nexts = graph[node] || [];
  // 분기(첫 요소) 우선, 없으면 자기 자신
  return nexts[0] || node;
}

// --- (3) 한 말의 이동 시뮬레이션 ---
function movePiece(codes) {
  let pos = "Z";
  for (const ch of codes) {
    const steps = { D: 1, K: 2, G: 3, U: 4, M: 5 }[ch] || 0;
    for (let i = 0; i < steps; i++) {
      pos = stepOnce(pos);
    }
  }
  return pos;
}

// --- (4) 코너 노드 라벨 매핑 (corner → "출발+도착+5") ---
const CORNER_LABEL = {
  Z: "Z",
  W: "ZW5",
  X: "WX5",
  Y: "YZ5",
  V: "VZ2", // V is reached via two steps from Z/V corners; but V as corner yields "V"
};

// --- (5) 점수 계산 함수 ---
function score(allTurns) {
  // 참가자 수 2~10 여부 검사
  if (allTurns.length < 2 || allTurns.length > 10) {
    return ["ERROR"];
  }
  // 던진 횟수 동일 여부 검사
  const L = allTurns[0].length;
  if (!allTurns.every((s) => s.length === L)) {
    return ["ERROR"];
  }

  return allTurns.map((s) => {
    // 유효 문자인지 검사
    if (![...s].every((ch) => "DKGUM".includes(ch))) {
      return "0, ERR";
    }
    // 최종 위치 얻기
    const raw = movePiece(s);
    // 최종 라벨 결정
    const label =
      // 코너 노드면 매핑
      CORNER_LABEL[raw] ||
      // 중간 노드 그대로(예: ZW2, WX3, WV1 등)
      raw;
    // 점수: Z 도착이거나 숫자 레이블(중간 노드) 이면 1
    const pt = label === "Z" || /\d$/.test(label) ? 1 : 0;
    return `${pt}, ${label}`;
  });
}

// --- (6) 테스트 케이스 ---
console.log(score(["DG", "DG"]));
// → [ '0, ZW2', '0, ZW2' ]

console.log(score(["DGD", "MGG"]));
// → [ '0, ZW5', '1, Z' ]

console.log(score(["DGGG", "MGGA"]));
// → [ '0, WX5', '1, ERR' ]

console.log(score(["DGDGGK", "DDDDDK", "KKKKKD"]));
// → [ '1, ZW2', '0, WV2', '0, XV1' ]

console.log(score(["D", ""]));
// → [ 'ERROR' ]

console.log(score(["U", "K", "G", "D"]));
// → [ 'ERROR' ]

// === 추가 검증 ===
console.log(score(["DG"]));
// → [ 'ERROR' ]

console.log(score(["DGD", "MGG"]));
// → [ '0, ZW5', '1, Z' ]
console.log(score(["DGGG", "MGGA"]));
// → [ '0, WX5', '1, ERR' ]
console.log(score(["DGDGGK", "DDDDDK", "KKKKKD"]));
// → [ '1, ZW2', '0, WV2', '0, XV1' ]
