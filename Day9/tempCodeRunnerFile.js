  } else {
    posLabel = `${from}${to}${used}`;
  }
  
  // 최종 위치가 Z인 경우, Z로 통일
  if (posLabel === 'VZZ3') posLabel = 'Z';


  return { posLabel, score };
}

/**
 * 참가자들의 점수와 말의 위치를 계산하는 메인 함수
 * @param {string[]} allTurns - 모든 참가자의 이동 문자열 배열
 * @returns {string[]} - 각 참가자의 [점수, 위치] 문자열 배열
 */
function score(allTurns) {
  // 1) 참가자 수 2~10명 규칙
  if (!allTurns || allTurns.length < 2 || allTurns.length > 10) {
    return ["ERROR"];
  }
  // 2) 모든 참가자의 던진 횟수(문자열 길이) 동일 규칙
  const L = allTurns[0].length;
  if (!allTurns.every((s) => s.length === L)) {
