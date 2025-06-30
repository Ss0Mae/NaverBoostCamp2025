// 화면(Screen)
type ScreenID =
  | "LOGIN"
  | "MAIN"
  | "EVENT_AD"
  | "CONTENT_1"
  | "CONTENT_2"
  | "CONTENT_N"
  | "MENU1_LIST"
  | "MENU1_DETAIL"
  | "MENU2_LIST"
  | "MENU2_SAVE"
  | "MENU3_STAGE1"
  | "MENU3_STAGE2"
  | "MENU3_TOGGLE";

// 이벤트 종류(Action)
enum ActionType {
  VIEW_SCREEN = "VIEW_SCREEN", // 화면 노출
  CLICK_BUTTON = "CLICK_BUTTON", // 버튼 클릭 (NEXT, BACK, SAVE 등)
  PUSH_SCREEN = "PUSH_SCREEN", // 푸시 스택에 쌓음
  POP_SCREEN = "POP_SCREEN", // 뒤로(pop)
  SCROLL = "SCROLL", // 스크롤 (세부 데이터 포함)
  TOGGLE = "TOGGLE", // ON/OFF 선택
  RANDOM_AD = "RANDOM_AD", // 광고 랜덤 표시
}

// 스크롤 세부 정보
interface ScrollDetail {
  direction: "UP" | "DOWN" | "LEFT" | "RIGHT";
  count: number; // 몇 번 스크롤했는지
  pageIndex?: number; // 마지막 페이지 인덱스(콘텐츠 마지막 화면)
}

// 랜덤 광고 정보
interface AdDetail {
  adId: number; // 1~5 중 랜덤 선택된 ID
}
