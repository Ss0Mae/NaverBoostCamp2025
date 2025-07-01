/**
 * @param {string[]} paths  // ex) [ '["/a/a_v2.xa"', ' "/b/a.xa"', ... , '"/k/k/k/a_v9.xa"]' ]
 * @returns {Map<string,number>}  // 2회 이상 중복된 원본 파일명 → 카운트
 */
function match(paths) {
  // 1) 입력 전처리: 양끝 대괄호, 따옴표, 공백 제거
  const clean = paths.map((p) =>
    p
      .trim()
      // 시작 [나 " 제거
      .replace(/^[\[\s"']+/, "")
      // 끝 ]나 " 제거
      .replace(/[\]"'\s]+$/, "")
  );

  // 2) 중간 집계용 Map
  const counts = new Map();

  for (const fullPath of clean) {
    // 파일명만 추출
    const idx = fullPath.lastIndexOf("/");
    const fileName = idx >= 0 ? fullPath.slice(idx + 1) : fullPath;

    // 버전 제거 + 확장자 검증
    const m = fileName.match(/^([a-z]+)(?:_v[1-9])?\.([a-z]{2})$/);
    if (!m) continue;

    // 원본명
    const original = `${m[1]}.${m[2]}`;

    // 카운트 누적
    counts.set(original, (counts.get(original) || 0) + 1);
  }

  // 3) 2회 이상만 결과 Map에 담기
  const result = new Map();
  for (const [name, cnt] of counts) {
    if (cnt >= 2) result.set(name, cnt);
  }
  return result;
}

// 데이터 입력/출력 부분
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let inputs = [];
rl.on("line", (line) => {
  inputs.push(line);
  if (inputs.length === 1) {
    rl.close();
  }
});

rl.on("close", () => {
  const fileArray = inputs[0].split(",");
  const answer = match(fileArray);
  if (answer.size == 0) {
    console.log("!EMPTY");
    rl.close();
    return;
  }
  for (const [key, value] of answer) {
    console.log(key + "=" + value);
  }
  rl.close();
});
