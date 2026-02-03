---
status: draft
created: 2026-02-03
spec: calculator/web-calculator
plan: calculator/web-calculator
---

# 작업 목록: 공학용 웹 계산기

## 작업 요약

| Phase | 작업 수 | 상태 |
|-------|--------|------|
| Phase 1: 프로젝트 기반 | 3 | 대기 |
| Phase 2: 계산 엔진 | 5 | 대기 |
| Phase 3: UI 컴포넌트 | 4 | 대기 |
| Phase 4: 키보드 입력 | 2 | 대기 |
| Phase 5: 히스토리 | 2 | 대기 |
| Phase 6: 테마 시스템 | 2 | 대기 |
| Phase 7: 통합 테스트 | 3 | 대기 |
| **총계** | **21** | |

---

## Phase 1: 프로젝트 기반 구조

### CALC-001: Vite + React + TypeScript 프로젝트 초기화

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** 없음

#### 설명
Vite를 사용하여 React + TypeScript 프로젝트를 생성하고 기본 설정을 완료합니다.

#### 완료 조건
- [ ] `npm create vite@latest` 실행
- [ ] tsconfig.json strict 모드 설정 (`"strict": true`)
- [ ] `npm run dev`로 개발 서버 정상 실행
- [ ] 기본 App.tsx 렌더링 확인

---

### CALC-002: 개발 도구 설정 (ESLint, Prettier)

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-001

#### 설명
코드 품질 도구를 설정합니다.

#### 완료 조건
- [ ] ESLint 설치 및 설정 (React, TypeScript 플러그인)
- [ ] Prettier 설치 및 설정
- [ ] `.eslintrc.cjs` 또는 `eslint.config.js` 생성
- [ ] `.prettierrc` 생성
- [ ] `npm run lint` 명령어 동작 확인

---

### CALC-003: 디렉토리 구조 및 테마 기반 설정

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-001

#### 설명
프로젝트 디렉토리 구조를 생성하고 CSS 변수 기반 테마 시스템을 설정합니다.

#### 완료 조건
- [ ] `src/components/`, `src/hooks/`, `src/context/`, `src/utils/`, `src/types/`, `src/styles/` 디렉토리 생성
- [ ] `src/styles/variables.css` - CSS 변수 정의
- [ ] `src/styles/themes.css` - 라이트/다크 테마 변수
- [ ] `src/styles/global.css` - 글로벌 스타일
- [ ] main.tsx에서 스타일 import

---

## Phase 2: 계산 엔진 구현

### CALC-004: 타입 정의 및 상수

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-003

#### 설명
계산기 상태, 연산자, 히스토리 등 TypeScript 타입을 정의합니다.

#### 완료 조건
- [ ] `src/types/calculator.ts` 생성
- [ ] `CalculatorState` 인터페이스 정의
- [ ] `Operator`, `AngleMode`, `HistoryEntry` 타입 정의
- [ ] `src/utils/constants.ts` - π, e 상수 정의

---

### CALC-005: 사칙연산 및 기본 계산 함수

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-004

#### 설명
기본 사칙연산 함수를 구현합니다.

#### 완료 조건
- [ ] `src/utils/calculator.ts` 생성
- [ ] `add`, `subtract`, `multiply`, `divide` 함수 구현
- [ ] 0으로 나누기 에러 처리
- [ ] `calculate(a, b, operator)` 통합 함수
- [ ] 단위 테스트 작성 (5개 시나리오)

---

### CALC-006: 공학 함수 구현

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-004

#### 설명
삼각함수, 로그, 제곱근 등 공학 함수를 구현합니다.

#### 완료 조건
- [ ] `src/utils/scientific.ts` 생성
- [ ] 삼각함수: `sin`, `cos`, `tan` (DEG/RAD 지원)
- [ ] 로그: `ln`, `log10`
- [ ] 거듭제곱: `sqrt`, `power`, `square`, `reciprocal`
- [ ] 에러 처리: 음수 제곱근, tan(90°), 음수/0 로그, 0의 역수
- [ ] 단위 테스트 작성 (14개 시나리오)

---

### CALC-007: 수식 파서 구현 (괄호 연산)

- **상태:** 대기
- **우선순위:** 🟡 MEDIUM
- **의존성:** CALC-005

#### 설명
괄호를 포함한 수식을 파싱하고 계산하는 파서를 구현합니다.

#### 완료 조건
- [ ] `src/utils/parser.ts` 생성
- [ ] 재귀 하강 파서 또는 Shunting-yard 알고리즘 구현
- [ ] 괄호 우선순위 처리: `(2+3)*4 = 20`
- [ ] 중첩 괄호 지원: `((2+3)*2)+5 = 15`
- [ ] 괄호 짝 불일치 에러 처리
- [ ] 단위 테스트 작성 (3개 시나리오)

---

### CALC-008: 계산기 리듀서 및 Context

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-005, CALC-006

#### 설명
useReducer 기반 계산기 상태 관리 로직을 구현합니다.

#### 완료 조건
- [ ] `src/hooks/useCalculator.ts` 생성
- [ ] 액션 타입 정의: DIGIT, OPERATOR, EQUALS, CLEAR, CLEAR_ENTRY, BACKSPACE, SCIENTIFIC, TOGGLE_ANGLE
- [ ] 리듀서 함수 구현
- [ ] `src/context/CalculatorContext.tsx` 생성
- [ ] 연속 연산 지원 (결과에 이어서 계산)
- [ ] 소수점 중복 입력 방지
- [ ] 단위 테스트 작성

---

## Phase 3: UI 컴포넌트 구현

### CALC-009: Button 공통 컴포넌트

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-003

#### 설명
재사용 가능한 버튼 컴포넌트를 생성합니다.

#### 완료 조건
- [ ] `src/components/Button/Button.tsx` 생성
- [ ] `src/components/Button/Button.module.css` 생성
- [ ] variant props: `number`, `operator`, `function`, `control`
- [ ] 호버, 액티브, 포커스 스타일
- [ ] 접근성: tabIndex, aria-label

---

### CALC-010: Display 컴포넌트

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-009

#### 설명
현재 입력값과 수식을 표시하는 디스플레이 컴포넌트를 구현합니다.

#### 완료 조건
- [ ] `src/components/Display/Display.tsx` 생성
- [ ] 현재 입력값 표시 (큰 글씨)
- [ ] 이전 수식 표시 (작은 글씨)
- [ ] 에러 상태 표시 스타일
- [ ] 숫자 오버플로우 시 폰트 크기 조절 또는 스크롤

---

### CALC-011: Keypad 및 ScientificPanel 컴포넌트

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-009, CALC-008

#### 설명
숫자/연산자 키패드와 공학 함수 패널을 구현합니다.

#### 완료 조건
- [ ] `src/components/Keypad/Keypad.tsx` - 숫자 0-9, 소수점, =, +, -, ×, ÷
- [ ] `src/components/ScientificPanel/ScientificPanel.tsx` - sin, cos, tan, ln, log, √, x^y, x², 1/x, π, e, (, )
- [ ] C, CE, ⌫ 제어 버튼
- [ ] DEG/RAD 토글 버튼
- [ ] CSS Grid 기반 레이아웃

---

### CALC-012: Calculator 레이아웃 통합

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-010, CALC-011

#### 설명
모든 컴포넌트를 통합한 Calculator 레이아웃을 구현합니다.

#### 완료 조건
- [ ] `src/components/Calculator/Calculator.tsx` 생성
- [ ] Display + ScientificPanel + Keypad 통합
- [ ] 반응형 레이아웃 (모바일/데스크톱)
- [ ] CalculatorContext.Provider 연결
- [ ] 기본 동작 테스트

---

## Phase 4: 키보드 입력 지원

### CALC-013: useKeyboard 훅 구현

- **상태:** 대기
- **우선순위:** 🟡 MEDIUM
- **의존성:** CALC-008

#### 설명
키보드 이벤트를 처리하는 커스텀 훅을 구현합니다.

#### 완료 조건
- [ ] `src/hooks/useKeyboard.ts` 생성
- [ ] 숫자 키 (0-9) → DIGIT 액션
- [ ] 연산자 키 (+, -, *, /) → OPERATOR 액션
- [ ] Enter, = → EQUALS 액션
- [ ] Escape → CLEAR 액션
- [ ] Backspace → BACKSPACE 액션
- [ ] 소수점 (.) → DIGIT 액션

---

### CALC-014: 키보드 통합 및 테스트

- **상태:** 대기
- **우선순위:** 🟡 MEDIUM
- **의존성:** CALC-013, CALC-012

#### 설명
키보드 훅을 Calculator에 통합하고 테스트합니다.

#### 완료 조건
- [ ] Calculator 컴포넌트에 useKeyboard 적용
- [ ] 포커스 관리 (계산기 영역 포커스 시에만 동작)
- [ ] 단위 테스트 작성 (5개 시나리오)

---

## Phase 5: 히스토리 기능

### CALC-015: HistoryPanel 컴포넌트

- **상태:** 대기
- **우선순위:** 🟡 MEDIUM
- **의존성:** CALC-012

#### 설명
계산 히스토리를 표시하는 패널을 구현합니다.

#### 완료 조건
- [ ] `src/components/HistoryPanel/HistoryPanel.tsx` 생성
- [ ] 히스토리 항목 목록 표시 (수식 = 결과)
- [ ] 항목 클릭 시 결과값 불러오기
- [ ] 전체 삭제 버튼
- [ ] 슬라이드 토글 애니메이션 (열기/닫기)

---

### CALC-016: 히스토리 상태 관리

- **상태:** 대기
- **우선순위:** 🟡 MEDIUM
- **의존성:** CALC-008, CALC-015

#### 설명
히스토리 저장 및 관리 로직을 구현합니다.

#### 완료 조건
- [ ] 리듀서에 ADD_HISTORY, CLEAR_HISTORY, LOAD_FROM_HISTORY 액션 추가
- [ ] 계산 완료 시 자동 히스토리 추가
- [ ] 히스토리 최대 개수 제한 (예: 50개)
- [ ] 단위 테스트 작성 (3개 시나리오)

---

## Phase 6: 테마 시스템

### CALC-017: ThemeContext 및 useLocalStorage

- **상태:** 대기
- **우선순위:** 🟢 LOW
- **의존성:** CALC-003

#### 설명
테마 상태 관리 및 로컬 스토리지 저장을 구현합니다.

#### 완료 조건
- [ ] `src/hooks/useLocalStorage.ts` 생성
- [ ] `src/context/ThemeContext.tsx` 생성
- [ ] 테마 상태: 'light' | 'dark'
- [ ] localStorage에 테마 설정 저장/불러오기
- [ ] 시스템 테마 감지 (prefers-color-scheme)

---

### CALC-018: ThemeToggle 컴포넌트

- **상태:** 대기
- **우선순위:** 🟢 LOW
- **의존성:** CALC-017

#### 설명
테마 전환 토글 버튼을 구현합니다.

#### 완료 조건
- [ ] `src/components/ThemeToggle/ThemeToggle.tsx` 생성
- [ ] 라이트/다크 모드 아이콘 표시
- [ ] 클릭 시 테마 전환
- [ ] Calculator에 통합
- [ ] 단위 테스트 작성 (3개 시나리오)

---

## Phase 7: 통합 및 테스트

### CALC-019: 컴포넌트 통합 테스트

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-012, CALC-014, CALC-015, CALC-018

#### 설명
전체 컴포넌트 통합 테스트를 작성합니다.

#### 완료 조건
- [ ] React Testing Library 기반 통합 테스트
- [ ] 사용자 클릭 시나리오 테스트
- [ ] 키보드 입력 시나리오 테스트
- [ ] 테마 전환 테스트
- [ ] 히스토리 동작 테스트

---

### CALC-020: 스펙 시나리오 E2E 테스트

- **상태:** 대기
- **우선순위:** 🔴 HIGH
- **의존성:** CALC-019

#### 설명
spec.md의 모든 GIVEN-WHEN-THEN 시나리오를 테스트합니다.

#### 완료 조건
- [ ] 기본 사칙연산 시나리오 5개 테스트
- [ ] 괄호 연산 시나리오 3개 테스트
- [ ] 공학 함수 시나리오 14개 테스트
- [ ] 소수점/연속연산 시나리오 3개 테스트
- [ ] 각도 모드 시나리오 2개 테스트
- [ ] 히스토리 시나리오 3개 테스트
- [ ] 키보드 입력 시나리오 5개 테스트
- [ ] 테마 시나리오 3개 테스트
- [ ] 화면 초기화 시나리오 3개 테스트
- [ ] 특수 상수 시나리오 2개 테스트
- [ ] 총 43개 시나리오 통과

---

### CALC-021: 접근성 검증 및 최종 정리

- **상태:** 대기
- **우선순위:** 🟡 MEDIUM
- **의존성:** CALC-020

#### 설명
접근성 검증 및 코드 정리를 수행합니다.

#### 완료 조건
- [ ] 색상 대비 검증 (WCAG AA 기준)
- [ ] 포커스 표시 검증
- [ ] 키보드 탐색 테스트 (Tab, Enter, Escape)
- [ ] 테스트 커버리지 80% 이상 확인
- [ ] 불필요한 코드 정리
- [ ] README.md 작성

---

## 의존성 그래프

```
CALC-001 (프로젝트 초기화)
├── CALC-002 (ESLint, Prettier)
└── CALC-003 (디렉토리, 테마)
    ├── CALC-004 (타입 정의)
    │   ├── CALC-005 (사칙연산)
    │   │   └── CALC-007 (수식 파서)
    │   └── CALC-006 (공학 함수)
    │       └── CALC-008 (리듀서, Context)
    │           ├── CALC-011 (Keypad, Scientific)
    │           ├── CALC-013 (useKeyboard)
    │           └── CALC-016 (히스토리 상태)
    ├── CALC-009 (Button)
    │   ├── CALC-010 (Display)
    │   └── CALC-011 (Keypad, Scientific)
    │       └── CALC-012 (Calculator 레이아웃)
    │           ├── CALC-014 (키보드 통합)
    │           ├── CALC-015 (HistoryPanel)
    │           └── CALC-019 (통합 테스트)
    └── CALC-017 (ThemeContext)
        └── CALC-018 (ThemeToggle)
            └── CALC-019 (통합 테스트)
                └── CALC-020 (E2E 테스트)
                    └── CALC-021 (접근성, 최종)
```

---

## 실행 순서 권장

### 1단계 (병렬 가능)
- CALC-001, CALC-002, CALC-003

### 2단계
- CALC-004

### 3단계 (병렬 가능)
- CALC-005, CALC-006, CALC-009

### 4단계 (병렬 가능)
- CALC-007, CALC-008, CALC-010

### 5단계 (병렬 가능)
- CALC-011, CALC-013, CALC-017

### 6단계
- CALC-012

### 7단계 (병렬 가능)
- CALC-014, CALC-015, CALC-016, CALC-018

### 8단계
- CALC-019

### 9단계
- CALC-020

### 10단계
- CALC-021
