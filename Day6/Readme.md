# 💡 상태관리를 위한 Interface, Entity 설계하기

## 1. 요구사항 분석하기

- 요구사항들을 내가 이해하기 쉽도록 해석을 해봤다.
1. 하루 동안 로그인 화면에 접속한 사용자 수
2. 이벤트 광고 화면을 가장 많이 본 사용자
3. 메인 화면을 가장 많이 본 시간대
4. 메뉴 1·2·3 화면 간 전환이 가장 빈번한 조합
5. 지난 일주일 동안 메뉴 2 저장 후 메인 화면으로 이동한 횟수
6. 하루 동안 메뉴 3 마지막 화면에서 ON/OFF 선택한 사용자 수
7. 최근 일주일 최저 노출 화면

- 이번 설계에서 중점을 둔 부분은 **어떤 데이터를, 언제, 어떻게 기록**해야 분석 목적에 맞춰 재구성하기 쉬운지에 대한 고민입니다.

### 1) 문제 분석

- **분석 대상**: 로그인, 화면 전환, 이벤트(광고·스크롤·토글) 등 UI 상 발생하는 모든 사용자 행동
- **분석 목적**: 일별·주별 사용자 접속·이벤트 통계, 전환 경로 최빈도, 특정 조건(저장→이동, ON/OFF 선택) 집계

### 2) 요구사항 도출

| **분석 시나리오** | **필요한 로그 정보** |
| --- | --- |
| 로그인 화면 접속 수 | `toScreen = LOGIN`, 타임스탬프, 사용자 ID (어떤페이지에 누가 언제) |
| 이벤트 광고 최대 시청자 | `action = RANDOM_AD`, `detail.adId`, 사용자 ID (어떤 광고를 누가) |
| 메인 화면 최다 노출 | `toScreen = MAIN`, 타임스탬프(시간대)  |
| 메뉴 간 전환 빈도 | `fromScreen`, `toScreen` (어떤 페이지에서 어디로 이동을 많이했는지) |
| 메뉴2 저장→메인 이동 | `action = CLICK_BUTTON`, `detail.button = SAVE`, `toScreen = MAIN` |
| 메뉴3 토글 사용자 수 | `action = TOGGLE`, `detail.value` |
| 최저 노출 화면 | 모든 `toScreen` 값 대비 카운트 |

### 3) 설계 고려사항

- **단일 테이블**에 모든 이벤트를 기록해 JOIN 없이 집계 가능
- `fromScreen`·`toScreen`으로 전환 경로를 쉽게 그룹화
- `detail` 필드로 이벤트별 추가 정보를 저장하도록 유연성 확보
- 타임스탬프 단위는 ms → 시간대, 일자 계산 시 가공 처리

### 4) 단계별 구현 계획

1. **로그 인터페이스 정의**: `HistoryLog` 타입과 `ScreenID`, `ActionType` 열거형 설계
2. **로그 기록 함수 개발**: UI 라이프사이클 또는 핸들러에서 호출할 `logEvent()` 작성
3. **데이터 저장소 연결**: 파일·DB 저장 백엔드 추상화
4. **샘플 데이터 수집**: 1일치 테스트 시나리오 실행 후 로그 추출
5. **분석 스크립트 작성**: 요구사항별 집계 쿼리(SQL/스크립트) 검증
6. **확장성 검토**: 신규 화면·이벤트 추가 시 `ScreenID`, `ActionType`만 확장

## **2. 주요 엔티티 및 타입 정의**

```tsx
// 화면(Screen)
type ScreenID =
  | 'LOGIN'
  | 'MAIN'
  | 'EVENT_AD'
  | 'CONTENT_1' | 'CONTENT_2' | 'CONTENT_N'
  | 'MENU1_LIST' | 'MENU1_DETAIL'
  | 'MENU2_LIST' | 'MENU2_SAVE'
  | 'MENU3_STAGE1' | 'MENU3_STAGE2' | 'MENU3_TOGGLE';

// 이벤트 종류(Action)
enum ActionType {
  VIEW_SCREEN = 'VIEW_SCREEN',   // 화면 노출
  CLICK_BUTTON = 'CLICK_BUTTON', // 버튼 클릭 (NEXT, BACK, SAVE 등)
  PUSH_SCREEN = 'PUSH_SCREEN',   // 푸시 스택에 쌓음
  POP_SCREEN = 'POP_SCREEN',     // 뒤로(pop)
  SCROLL = 'SCROLL',             // 스크롤 (세부 데이터 포함)
  TOGGLE = 'TOGGLE',             // ON/OFF 선택
  RANDOM_AD = 'RANDOM_AD'         // 광고 랜덤 표시
}

// 스크롤 세부 정보
interface ScrollDetail {
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  count: number;         // 몇 번 스크롤했는지
  pageIndex?: number;    // 마지막 페이지 인덱스(콘텐츠 마지막 화면)
}

// 랜덤 광고 정보
interface AdDetail {
  adId: number;          // 1~5 중 랜덤 선택된 ID
}
```

## 3. 이력 로그 레코드 구조

- **단일 컬렉션(Table) 활용 이유**:
    1. 다양한 이벤트 유형(View, Click, Scroll, Toggle 등)을 하나의 스키마로 수용하여 추가 테이블·조인이 불필요
    2. `fromScreen`·`toScreen` 필드로 전환 분석을 단일 레코드에서 바로 수행 가능
    3. `detail` 속성으로 이벤트별 부가 데이터를 유연하게 저장해 구조 변경 없이 확장성 보장
- **타임스탬프(ms 단위) 선택 이유**:
    1. 초 단위만 기록하면 세부 시간대 분석(분·초)에서 불가피하게 정밀도를 잃음
    2. ms 단위로 기록하고, 쿼리 시 뷰단에서 원하는 시간 단위(일·시·분)로 변환하여 활용
- **JSON 구조(Any 타입)로 `detail` 저장 이유**:
    1. 광고 랜덤 선택, 스크롤 방향·횟수, ON/OFF 토글 등 각 이벤트마다 필드가 상이해 고정 스키마로 표현하기 어렵고,
    2. 추후 신규 이벤트 속성 추가 시 DB, 테이블 구조 변경 없이 바로 로그 레코드 확장 가능
- **샘플 데이터 예시** (TypeScript 인터페이스)

```tsx
interface HistoryLog {
  userId: string;
  timestamp: number;
  fromScreen?: ScreenID;
  toScreen: ScreenID;
  action: ActionType;
  detail?: any;
}
```

- 모든 사용자 액션은 단일 컬렉션(Table) `HistoryLog`에 저장
- **HistoryLog** 한 건 예시 (TypeScript 인터페이스)

```tsx
interface HistoryLog {
  userId: string;         // 사용자 식별자
  timestamp: number;      // UNIX ms
  fromScreen?: ScreenID;  // 이전 화면 (null 가능: 첫 진입)
  toScreen: ScreenID;     // 노출된/전환된 화면
  action: ActionType;     // 수행된 액션
  detail?: any;           // SCROLL → ScrollDetail, RANDOM_AD → AdDetail 등
}
```

### Sample Data

```tsx
{
  "userId": "user123",
  "timestamp": 1688000000000,
  "fromScreen": null,
  "toScreen": "LOGIN",
  "action": "VIEW_SCREEN"
},
{
  "userId": "user123",
  "timestamp": 1688000012000,
  "fromScreen": "LOGIN",
  "toScreen": "MAIN",
  "action": "CLICK_BUTTON"
},
{
  "userId": "user123",
  "timestamp": 1688000020000,
  "toScreen": "EVENT_AD",
  "action": "RANDOM_AD",
  "detail": {"adId": 3}
}
```

## 4. 로그 저장 흐름 (프로그램 구조)

1. **화면 진입(View)**
    - 사용자 UI 라이프사이클 훅(`onShow` 등)에서
    - `logEvent({action: VIEW_SCREEN, toScreen: currentScreen})`
2. **버튼 클릭 및 푸시/팝**
    - 버튼 핸들러 내에서
    - `logEvent({action: CLICK_BUTTON, fromScreen, toScreen, detail: { button: 'NEXT'}})`
    - 푸시(push) 구분 시 `PUSH_SCREEN` 액션 추가 가능
3. **스크롤/토글**
    - 스크롤 완료 시 `logEvent({action: SCROLL, detail: scrollDetail})`
    - 메뉴 3 토글 시 `logEvent({action: TOGGLE, detail: {value: 'ON'}})`

```tsx
function logEvent(event: Partial<HistoryLog>) {
  const record: HistoryLog = {
    userId: getCurrentUserId(),
    timestamp: Date.now(),
    ...event
  };
  Database.insert('HistoryLog', record);
}
```

## 5. 데이터 분석 예시

- **하루 로그인 화면 접속 수**: `SELECT COUNT(DISTINCT userId) FROM HistoryLog WHERE toScreen='LOGIN' AND DATE(timestamp)=TODAY`
- **최다 이벤트 광고 시청자**: `GROUP BY userId, action='RANDOM_AD'` → `ORDER BY COUNT DESC`
- **메인 화면 최다 노출 시간대**: 시간대별 `WHERE toScreen='MAIN'` 집계
- **화면 전환 빈도**: `GROUP BY fromScreen,toScreen`
- **메뉴2 저장→메인 이동 횟수(일주일)**: `WHERE action='CLICK_BUTTON' AND detail.button='SAVE' AND toScreen='MAIN' AND timestamp>=ONE_WEEK_AGO`
- **메뉴3 ON/OFF 사용자 수(하루)**: `WHERE action='TOGGLE' AND DATE(timestamp)=TODAY` → `COUNT(DISTINCT userId)`
- **최저 노출 화면(일주일)**: 전체 `ScreenID` 집합에서 `HistoryLog` 노출 수 최소값 화면

---