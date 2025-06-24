## **학습 키워드**

**디버거 ,빌드, 통합개발환경**

## **추가 정보**

**난이도**

**하**

---

**중요도**

**중요**

---

**권장 학습 시간**

**1H**

---

**미션 해결 예상 시간**

**3H**

# **학습 목표**

- 로컬에 통합 개발 환경을 설정한다.
- 코드를 개발 환경에서 빌드해서 동작하는 것을 확인한다.
- 디버거로 브레이크 포인트를 지정하고 스텝-오버, 스텝-인, 넥스트 명령을 실습한다.
- 주어진 요구사항에 맞게 주어진 코드를 수정하거나 개선한다.

# **사전지식**

- 없음

# **기능요구사항**

### **개발 환경**

- 개발 도구는 자유롭게 본인이 선택할 수 있다.
- JS 추천 환경
    - VS Code(Visual Studio Code) 추천
    - Node.js 프로그램을 설치한다 (v22 버전 이상 권장)
- 기존에 작성된 코드를 분석하고 개선하는 과정을 나름대로 잘 기록해 두자. [학습 저장소 제출 📮] 시 기록한 내용을 제출해야 한다.

### **개발 범위**

OOO 회사에 입사 첫날, 예전 개발자가 만들다 멈춘 **`보드 게임에서 말의 움직임`**을 판단하는 코드를 공유해 주었다. 1번부터 시작하고 주사위를 굴려서 나온 숫자만큼 전진하는 보드 게임이다. 다음 보드 게임 이미지에서 사다리가 놓인 칸에 도착한 경우만 사다리를 타고 더 높은 숫자 칸으로 올라갈 수 있다.

![ladder.png](https://lucas-image.codesquad.kr/1747121428825ladder.png)

### **요구사항 역분석하기**

- 주사위 숫자만큼 이동해서 도착할 위치를 계산하는 판단 조건과 변수 의미를 정리해서 기록한다.

### **디버깅해서 개선하기**

- 기존 코드는 이상하게도 그대로 실행하면 몇 가지 오류가 있다. 어떤 오류가 있는지 코드를 찾아서 개선한다.
    - 기존 코드 ⇒ 개선한 코드 모두 기록한다.
- 개선한 이후 동작을 확인하기 위한 입력/출력 처리 코드를 직접 추가하고 디버깅한다.

### **새로운 요구사항 추가하기**

알고 보니 보드 게임에는 다른 규칙이 있었다. 새로운 규칙까지 반영하기 위해서 변경해야 하는 작업 범위를 작성하고 새로운 요구사항을 추가로 구현한다.

새로운 요구사항은 기존 사다리와 반대되는 형태로 특정 칸에 도착하면 뱀에게 물려서 더 낮은 숫자로 떨어진다.

![snake.png](https://lucas-image.codesquad.kr/1747121439611snake.png)

- 사다리 동작과 뱀 동작을 구분해서 별도 함수로 분리한다.
- 구현한 이후 동작을 확인하기 위한 입력/출력 조건을 추가한다.

# **프로그래밍 요구사항**

JS, Swift, Kotlin 세 가지 중에 하나를 선택해서 진행한다.

### **JS**

```tsx
**function nextPosition(current, dice) {
    const next = current + dice;
    if (next == 4) {
        return dice + 10;
    }
    else if (next == 8) {
        return dice + 22;
    }
    else if (next == 28) {
        return dice + 48;
    }
    else if (next == 21) {
        return dice + 42;
    }
    else if (next == 50) {
        return dice + 17;
    }
    else if (next == 71) {
        return dice + 92;
    }
    else if (next == 80) {
        return dice + 19;
    }
    
    return dice;    
}

let start = 1;
let next = 1;
let dice = 3;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = next;
dice = 4;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = next;
dice = 3;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = next;
dice = 5;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);

start = next;
dice = 1;
next = start + nextPosition(start, dice);
console.log("from=",start,", dice=",dice,", next=", next);**
```

---

# 기존 요구사항 이해하기

- 우선 **`start와 next`**는 1로 초기화 되었고, `dice`를 매 턴마다 사용자가 직접 설정 후 함수를 호출하여 조작하고 있다.
- 기존 로그는 **`console.log("from=",start,", dice=",dice,", next=", next);` 로 어디서 출발해서 주사위가 어떤 수가 나와서 어디로 간다라는 의미로 작성한 것 같다.**
- 그 와중에 문제에 서술된 사다리 로직에 따라 `next` 가 어떤 값이 되냐에 따라 사다리가 있는 곳이면 문제에 맞게 말을 이동시키는 의도로 보인다.

> 우선 기존 파일을 돌려보자!
결과 값은 아래와 같다
> 

### 기존 출력 값

```tsx
from= 1 , dice= 3 , next= 14
from= 14 , dice= 4 , next= 18
from= 18 , dice= 3 , next= 63
from= 63 , dice= 5 , next= 68
from= 68 , dice= 1 , next= 69
```

- 이를 실제 보드게임 판과 비교해 본다면 이상함이 느껴진다.
- 기존 요구사항에 맞춰본다면 다음과 같이 출력되어야 할 것이다

### 원래 의도 대로의 출력 값

```tsx
from= 1 , dice= 3 , next= 14
from= 14 , dice= 4 , next= 18
from= 18 , dice= 3 , next= 42
from= 42 , dice= 5 , next= 47
from= 47 , dice= 1 , next= 48
```

<aside>
💡

**왜 이렇게 된걸까?**

현재 코드에서는 주사위를 한번 굴린 이후 **`start`**에 이전 결과값인 **`next`** 를 할당하기 때문에 현재 로그에서 from을 나타내는 start가 틀리는건 어쩔 수 없는것이고, 결국 next의 값이 틀리다는 의미이다.
**`next = start + nextPosition(start, dice);` 
결국 이 식에서 함수의 반환값이 잘못 되었다는 것을 알 수 있다.**

</aside>

### 함수의 문제점

```tsx
**function nextPosition(current, dice) {
    const next = current + dice;
    if (next == 4) {
        return dice + 10;
    }
    else if (next == 8) {
        return dice + 22;
    }
    else if (next == 28) {
        return dice + 48;
    }
    else if (next == 21) {
        return dice + 42;
    }
    else if (next == 50) {
        return dice + 17;
    }
    else if (next == 71) {
        return dice + 92;
    }
    else if (next == 80) {
        return dice + 19;
    }
    
    return dice;    
}

next = start + nextPosition(start, dice);**
```

- `start` 에다가 함수가 돌려준 값을 더해서 “최종 위치(next)” 를 얻겠다는 의도로 보인다
- 하지만 함수가 반환하는 값을 살펴보면 어딘가 이상한 부분이 존재한다.

```tsx
function nextPosition(current, dice) {
  const next = current + dice;

  else if (next == 21) {
    return dice + 42;
  } else if (next == 71) {
    return dice + 92;
  } 
}
```

- 현재 **`next`**의 값이 **21**이 될 경우 21→ 42로 이동해야하는데 이동할 번호를 더 하는식으로 되기 때문에 값이 이상하게 된다!
- 마찬가지로 **`next`**의 값이 71이 될 경우 71 → 92로 이동해야하는데 이동할 번호를 더 하는 식으로 작성되었기 때문에 값이 이상해 진다
- **사다리가 있는 칸**에서 **`dice + 42`**를 반환하면 → 호출부에서는 **`start + (dice + 42)`**가 되어

→ **`18 + (3 + 42) = 63`  이라는 값이 반환되게 된다.**

- **원래 의도에 맞게 얼마나 더 이동해야하는지에 대한 이동 값으로 수정해주자**

```tsx
function nextPosition(current, dice) {
  const next = current + dice;
  if (next == 4) {
    return dice + 10;
  } else if (next == 8) {
    return dice + 22;
  } else if (next == 28) {
    return dice + 48;
  } else if (next == 21) {
    return dice + 21;
  } else if (next == 50) {
    return dice + 17;
  } else if (next == 71) {
    return dice + 21;
  } else if (next == 80) {
    return dice + 19;
  }

  return dice;
}

let start = 1;
let next = 1;
let dice = 3;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = next;
dice = 4;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = next;
dice = 3;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = next;
dice = 5;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

start = next;
dice = 1;
next = start + nextPosition(start, dice);
console.log("from=", start, ", dice=", dice, ", next=", next);

```

- 이렇게 모든 사다리에 대해 하드코딩을 하면  다음과 같이 본래의 의도에 맞게 출력이 된다.

```tsx
from= 1 , dice= 3 , next= 14
from= 14 , dice= 4 , next= 18
from= 18 , dice= 3 , next= 42
from= 42 , dice= 5 , next= 47
from= 47 , dice= 1 , next= 48
```

- 사다리들이 모두 정상 작동하는지 테스트케이스와 로그를 추가해보자

```tsx
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
  const result = 0 + nextPosition(0, dice);
  const pass = result === expected ? "✅" : "❌";
  console.log(`${pass} dice=${dice} → next=${result} (기댓값${expected})`);
}
```

- 결과값은 다음과 같으며 모두 테스트에 통과한걸 확인 가능하다/

```tsx
사다리 기능 검증:
✅ dice=4 → next=14 (기댓값14)
✅ dice=8 → next=30 (기댓값30)
✅ dice=21 → next=42 (기댓값42)
✅ dice=28 → next=76 (기댓값76)
✅ dice=50 → next=67 (기댓값67)
✅ dice=71 → next=92 (기댓값92)
✅ dice=80 → next=99 (기댓값99)
```

---

# 코드 개선하기

<aside>
💡

현재는 함수가 **“함수 호출 후 더해줄 값”** 을 돌려주는 형식이다. 특정 칸에 대해 조건문을 이용하여 
특수한 케이스에 맞춰 일일히 하드코딩을 하고 있는 형식이다. 이는 새로운 조건이 추가 되면 조건문이 하나 더 추가되는 형식이다. 이를 좋다고 생각할 수 있지만 이는 코드의 가독성도 떨어뜨리고 코드가 경직된다고 생각하며, 우리가 앞으로 추가할 ‘뱀’기능을 생각하면 개선하는게 좋다고 생각한다.

</aside>

> **“사다리 출발 칸” → “도착 칸” 을 매핑 시켜서 계산 실수도 줄이고 깔끔하게 정리해보자!**
> 

```tsx
const ladders = { // 사다리 데이터 매핑 (절대위치)
  4: 14,
  8: 30,
  21: 42,
  28: 76,
  50: 67,
  71: 92,
  80: 99,
};

function nextPosition(current, dice) { 
  const pos = current + dice; // 주사위 굴린 뒤에 도착하는 칸
  return ladders[pos] ?? pos; // 사다리가 있으면 도착칸, 없으면 그냥 pos
}

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
  const result = 0 + nextPosition(0, dice);
  const pass = result === expected ? "✅" : "❌";
  console.log(`${pass} dice=${dice} → next=${result} (기댓값${expected})`);
}

let current = 1;
const rolls = [3, 4, 3, 5, 1];

for (const dice of rolls) {
  const next = nextPosition(current, dice);
  console.log(`from=${current} , dice=${dice} , next=${next}`);
  current = next;
}
```

> 개선점은 다음과 같다
> 
- 사다리 시작 점 → 도착 점을 객체 형태로 매핑을 해주었다. 이를 통해 원본 코드처럼 계산 실수에 대한 부담감이 없어지는 효과를 지닐 수 있다.
- **`nextPosition`** 함수도 개선하여 사다리가 존재하는 칸과 아닌 칸을 한줄에 처리할 수 있도록 하였다.
- 이후 원할한 테스트를 위해 기존 코드에서 반복문을 이용하여 테스트를 용이하게 했다.

## 결과 로그

```tsx
✅ dice=4 → next=14 (기댓값14)
✅ dice=8 → next=30 (기댓값30)
✅ dice=21 → next=42 (기댓값42)
✅ dice=28 → next=76 (기댓값76)
✅ dice=50 → next=67 (기댓값67)
✅ dice=71 → next=92 (기댓값92)
✅ dice=80 → next=99 (기댓값99)

from=1 , dice=3 , next=14
from=14 , dice=4 , next=18
from=18 , dice=3 , next=42
from=42 , dice=5 , next=47
from=47 , dice=1 , next=48
```

- 원래의 결과값은 유지하면서, 기존 코드처럼 계산의 실수는 없이, 간단한 테스트를 추가할 수 있도록 수정하여 코드의 품질을 향상 시켰다

---

# 새로운 요구사항 추가하기

- 새로운 요구사항은 기존 사다리와 반대되는 형태로 특정 칸에 도착하면 뱀에게 물려서 더 낮은 숫자로 떨어진다.
- 뱀 칸은 다음과 같다

```tsx
32 -> 10, 36 -> 6, 48 -> 26, 62 -> 18, 88 -> 24, 95 -> 56, 97 -> 78
```

- 사다리 동작과 뱀 동작을 구분해서 별도 함수로 분리한다.
- 구현한 이후 동작을 확인하기 위한 입력/출력 조건을 추가한다.

## 구현 과정

1. **사다리·뱀 충돌 여부 확인**
    - 우선 사다리(start → end)와 뱀(head → tail)가 같은 출발 위치를 갖고 있는지 검사했습니다.
    - 만약 둘이 겹친다면, 연속해서 사다리를 타고 다시 뱀에 물리는 등 의도치 않은 동작이 발생할 수 있기 때문입니다.
    - 검토 결과, 겹치는 칸은 없었으므로 다음 단계로 넘어갔습니다.
2. **함수 분리 및 리팩토링**
    - 기존에 작성한 `nextPosition` 함수 내부에서 사다리와 뱀 로직이 뒤섞여 있던 것을
        1. `applyLadder(pos)`
        2. `applySnake(pos)`
            
            두 개의 별도 함수로 분리했습니다.
            
    - 이렇게 분리해 두면 향후 사다리나 뱀의 동작만 수정할 때, 해당 함수만 손보면 되므로 유지보수가 쉬워집니다.
3. **뱀 로직 추가**
    - `snakes` 객체에 아래 매핑을 정의했습니다.
    
    ```tsx
    const snakes = {
      32: 10,
      36:  6,
      48: 26,
      62: 18,
      88: 24,
      95: 56,
      97: 78,
    };
    
    ```
    
    - `applySnake(pos)` 함수는 `snakes[pos]`가 있으면 그 값을, 없으면 그대로 `pos`를 반환하도록 구현했습니다.
    - `nextPosition` 함수에서는
    
    ```jsx
    const raw       = current + dice;
    const afterLadder = applyLadder(raw);
    const afterSnake  = applySnake(afterLadder);
    return afterSnake;
    ```
    
    순서대로 호출하도록 수정했습니다.
    
    <aside>
    💡
    
    **호출 순서에 관한 고민**
    
    1. **주사위 이동 → 사다리 적용 → 뱀 적용**
        - 우선 `current + dice` 로 이동한 칸을 기준으로
        - **사다리(발판)** 가 있으면 먼저 올라타고,
        - 올라간 위치에 **뱀(머리)** 가 있으면 그다음에 내려오는 순서로 정했습니다
    2. **게임의 자연스러운 흐름 반영**
        - 실제 스네이크 앤 래더 게임 규칙에서,
            - 플레이어가 칸에 도착하면(주사위 결과)
            - 해당 칸이 사다리 발판이면 먼저 위로 올라가고,
            - 만약 올라간 곳에 뱀이 있으면 떨어집니다.
    3. **미래 확장성**
        - 현재는 “사다리 발판 ≠ 뱀 머리” 로 겹침이 없어 두 순서가 결과가 같지만,
        - **어떤 보드에서는** 뱀 머리 바로 위에 사다리 발판을 추가하거나
        - “사다리 끝에 또 다른 뱀” 같은 복합 구조를 만들 수도 있습니다
        - 그런 경우에도 “사다리 먼저 → 뱀” 으로 처리해 두면
            1. 주사위로 이동
            2. 올라갈 사다리 전부 적용
            3. 마지막으로 뱀에 물려야 할지 검사
                
                의 흐름이 깨지지 않습니다.
                
    
    정리하자면, **게임 룰과 확장 가능성을 고려해 “사다리 → 뱀” 순서** 로 처리하시는 게 깔끔할것 같아서 이와 같이 적용했습니다
    
    </aside>
    
4. **기능 검증 및 시뮬레이션**
- 사다리와 뱀 각각에 대해 단위 검증 코드를 작성하여, “출발칸 + dice → 기대값”이 일치하는지 확인했습니다.
- 마지막으로 실제 게임 턴(예: `[3,4,3,5,1]`)을 시뮬레이션하며 전체 흐름이 올바른지 콘솔 로그로 검증했습니다.

## 완성 코드

```jsx
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
  console.log(`${pass} dice=${dice} → next=${result} (기댓값 ${expected})`);
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

```