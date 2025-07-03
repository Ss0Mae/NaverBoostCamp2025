const STATE = Object.freeze({
  IDLE: "IDLE", // 시작 전 대기 상태
  INVITED: "INVITED", // INVITE 요청 수신 후
  AUTH_REQUESTED: "AUTH REQUESTED", // 407 Proxy Authorization 요청 후
  REDIRECTING: "REDIRECTING", // 3xx 리디렉션 응답 수신 후
  REDIRECTED: "REDIRECTED", // ACK 완료된 리디렉션 처리 상태
  ACCEPTED: "ACCEPTED", // 200 OK 응답 수신 후
  ESTABLISHED: "ESTABLISHED", // ACK 완료, 콜 연결 성립
  CLOSING: "CLOSING", // BYE 요청 처리 중
  TERMINATED: "TERMINATED", // BYE 응답 또는 최종 종료
  CANCELLING: "CANCELLING", // CANCEL 요청 중간 상태
  CANCELLED: "CANCELLED", // CANCEL 완료 후
  FAILED: "FAILED", // 4xx~6xx 오류 처리 후
});
const EVENT = Object.freeze({
  INVITE: /^INVITE$/, // INVITE 요청
  ACK: /^ACK$/, // ACK 요청
  CANCEL: /^CANCEL$/, // CANCEL 요청
  BYE: /^BYE$/, // BYE 요청
  TIMEOUT: /^<timeout>$/, // 타임아웃 (예: ACK 미수신)
  RESP_1XX: /^1\d\d$/, // 100~199 응답
  RESP_200: /^200$/, // 200 OK 응답
  RESP_3XX: /^3\d\d$/, // 300~399 리디렉션 응답
  RESP_407: /^407$/, // Proxy Authentication Required
  RESP_487: /^487$/, // Request Terminated
  RESP_ERR: /^[456]\d\d$/, // 400~699 오류 응답
});
const TRANSITIONS = {
  [STATE.IDLE]: [{ eventKey: "INVITE", nextState: STATE.INVITED }],
  [STATE.INVITED]: [
    { eventKey: "RESP_1XX", nextState: STATE.INVITED },
    { eventKey: "RESP_407", nextState: STATE.AUTH_REQUESTED },
    { eventKey: "RESP_3XX", nextState: STATE.REDIRECTING },
    { eventKey: "ACK", nextState: STATE.INVITED },
    { eventKey: "RESP_200", nextState: STATE.ACCEPTED },
    { eventKey: "CANCEL", nextState: STATE.CANCELLING },
    { eventKey: "RESP_ERR", nextState: STATE.FAILED },
  ],
  [STATE.AUTH_REQUESTED]: [
    { eventKey: "ACK", nextState: STATE.INVITED },
    { eventKey: "RESP_407", nextState: STATE.AUTH_REQUESTED },
  ],
  [STATE.REDIRECTING]: [{ eventKey: "ACK", nextState: STATE.REDIRECTED }],
  [STATE.REDIRECTED]: [
    { eventKey: "INVITE", nextState: STATE.INVITED },
    { eventKey: "TIMEOUT", nextState: STATE.TERMINATED },
    { eventKey: "RESP_487", nextState: STATE.TERMINATED },
  ],
  [STATE.ACCEPTED]: [
    { eventKey: "CANCEL", nextState: STATE.CANCELLING },
    { eventKey: "ACK", nextState: STATE.ESTABLISHED },
  ],
  [STATE.CANCELLING]: [{ eventKey: "RESP_200", nextState: STATE.CANCELLED }],
  [STATE.CANCELLED]: [{ eventKey: "ACK", nextState: STATE.TERMINATED }],
  [STATE.FAILED]: [{ eventKey: "ACK", nextState: STATE.TERMINATED }],
  [STATE.ESTABLISHED]: [{ eventKey: "BYE", nextState: STATE.CLOSING }],
  [STATE.CLOSING]: [
    { eventKey: "BYE", nextState: STATE.CLOSING },
    { eventKey: "RESP_200", nextState: STATE.TERMINATED },
  ],
};
/**
 * 주어진 이벤트 시퀀스를 처리하여 상태 전이 이력을 반환
 * @param {string[]} events - SIP 이벤트 또는 응답 코드 문자열 배열
 * @returns {string[]} - 발생한 상태 전이 순서 배열
 */
function runStateMachine(events) {
  const history = [];
  let currentState = STATE.IDLE;

  for (const ev of events) {
    const rules = TRANSITIONS[currentState] || [];
    let transitioned = false;

    // 전이 규칙 순회: 첫 매칭 규칙 적용
    for (const { eventKey, nextState } of rules) {
      if (EVENT[eventKey].test(ev)) {
        currentState = nextState;
        history.push(currentState);
        transitioned = true;
        break;
      }
    }
  }

  return history;
}
// 시나리오 1: INVITE → CANCEL → 200 → 487 → ACK
console.log(runStateMachine(["INVITE", "CANCEL", "200", "487", "ACK"]));
// 예상: ["INVITED","CANCELLING","CANCELLED","TERMINATED"]

// 시나리오 2: INVITE → 180 → 200 → ACK → BYE → 200
console.log(runStateMachine(["INVITE", "180", "200", "ACK", "BYE", "200"]));
// 예상: ["INVITED","INVITED","ACCEPTED","ESTABLISHED","CLOSING","TERMINATED"]

// 시나리오 3: INVITE → 407 → ACK → 301 → ACK → <timeout>
console.log(
  runStateMachine(["INVITE", "407", "ACK", "301", "ACK", "<timeout>"])
);
// 예상: ["INVITED","AUTH REQUESTED","INVITED","REDIRECTING","REDIRECTED","TERMINATED"]

// 시나리오 4: INVITE → 404 → ACK → <timeout>
console.log(runStateMachine(["INVITE", "404", "ACK", "<timeout>"]));
// 예상: ["INVITED","FAILED","TERMINATED"]
