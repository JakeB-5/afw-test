---
status: draft
created: 2026-02-03
spec: calculator/web-calculator
---

# 구현 계획: 공학용 웹 계산기

## 기술 결정

### 결정 1: 상태 관리 - useReducer + Context

**근거:**
- 계산기 상태(현재값, 이전값, 연산자, 히스토리, 각도 모드, 테마)가 복잡하게 연결됨
- Redux는 이 규모에 과함, useState는 상태 로직 분산 위험
- useReducer로 순수 함수 기반 상태 전이, Context로 전역 공유

### 결정 2: 스타일링 - CSS Modules + CSS 변수

**근거:**
- 테마 변경에 CSS 변수가 효율적 (JS 리렌더 불필요)
- CSS Modules로 스코프 격리, 클래스 충돌 방지
- styled-components 대비 번들 크기 감소

### 결정 3: 계산 엔진 - 직접 구현 (라이브러리 미사용)

**근거:**
- 외부 의존성 최소화 (math.js 등 대형 라이브러리 불필요)
- 학습 목적 및 완전한 제어권
- 필요 연산이 JavaScript Math 객체로 충분

### 결정 4: 테스트 프레임워크 - Vitest + React Testing Library

**근거:**
- Constitution에서 지정한 필수 스택
- Vite와 원활한 통합
- Jest 호환 API로 학습 곡선 낮음

---

## 구현 단계

### Phase 1: 프로젝트 기반 구조

프로젝트 초기화 및 기본 설정

**산출물:**
- [ ] Vite + React + TypeScript 프로젝트 생성
- [ ] tsconfig.json strict 모드 설정 (strict: true)
- [ ] ESLint, Prettier 설정
- [ ] 디렉토리 구조 생성
- [ ] CSS 변수 기반 테마 시스템 설정
- [ ] 기본 컴포넌트 스켈레톤

**디렉토리 구조:**
```
src/
├── components/
│   ├── Calculator/
│   │   ├── Calculator.tsx
│   │   ├── Calculator.module.css
│   │   └── index.ts
│   ├── Display/
│   ├── Keypad/
│   ├── ScientificPanel/
│   ├── HistoryPanel/
│   └── ThemeToggle/
├── hooks/
│   ├── useCalculator.ts
│   ├── useKeyboard.ts
│   └── useLocalStorage.ts
├── context/
│   ├── CalculatorContext.tsx
│   └── ThemeContext.tsx
├── utils/
│   ├── calculator.ts      # 계산 로직
│   ├── scientific.ts      # 공학 함수
│   └── constants.ts       # π, e 등
├── types/
│   └── calculator.ts
├── styles/
│   ├── variables.css
│   ├── themes.css
│   └── global.css
├── App.tsx
└── main.tsx
```

---

### Phase 2: 계산 엔진 구현

핵심 계산 로직 및 상태 관리

**산출물:**
- [ ] 계산기 상태 타입 정의 (types/calculator.ts)
- [ ] 계산기 리듀서 구현 (hooks/useCalculator.ts)
- [ ] 사칙연산 함수 구현 (utils/calculator.ts)
- [ ] 괄호 연산 파서 구현 (수식 파싱)
- [ ] 공학 함수 구현 (utils/scientific.ts)
- [ ] x², 1/x 함수 구현
- [ ] 각도 모드 변환 (DEG/RAD)
- [ ] 에러 처리 (0 나누기, 음수 제곱근, tan(90°), 음수/0 로그, 0의 역수)
- [ ] 단위 테스트 작성

**상태 구조:**
```typescript
interface CalculatorState {
  display: string;
  previousValue: string | null;
  operator: Operator | null;
  waitingForOperand: boolean;
  angleMode: 'DEG' | 'RAD';
  history: HistoryEntry[];
  error: string | null;
}
```

---

### Phase 3: UI 컴포넌트 구현

사용자 인터페이스 개발

**산출물:**
- [ ] Display 컴포넌트 (현재값 + 수식 표시)
- [ ] Keypad 컴포넌트 (숫자 + 기본 연산자)
- [ ] ScientificPanel 컴포넌트 (공학 함수 버튼)
- [ ] ⌫ (백스페이스) 버튼 컴포넌트
- [ ] Button 공통 컴포넌트
- [ ] Calculator 레이아웃 컴포넌트
- [ ] 반응형 그리드 레이아웃

**버튼 그룹:**
```
┌─────────────────────────────────────┐
│  수식 표시                           │
│  현재 입력값                         │
├─────────────────────────────────────┤
│ sin │ cos │ tan │ DEG │ C  │ CE │ ⌫ │
│ ln  │ log │ √   │ x^y │ (  │ )  │ ÷ │
│ π   │ e   │ x²  │ 1/x │ 7  │ 8  │ 9 │
│     │     │     │  ×  │ 4  │ 5  │ 6 │
│     │     │     │  -  │ 1  │ 2  │ 3 │
│     │     │     │  +  │ 0  │ .  │ = │
└─────────────────────────────────────┘
```

---

### Phase 4: 키보드 입력 지원

키보드 이벤트 처리

**산출물:**
- [ ] useKeyboard 커스텀 훅 구현
- [ ] 숫자 키 (0-9) 매핑
- [ ] 연산자 키 (+, -, *, /) 매핑
- [ ] 특수 키 (Enter, Escape, Backspace) 매핑
- [ ] 키보드 테스트 작성

**키 매핑:**
| 키 | 동작 |
|----|------|
| 0-9 | 숫자 입력 |
| + - * / | 연산자 |
| Enter, = | 계산 실행 |
| Escape | 전체 초기화 (C) |
| Backspace | 마지막 삭제 |
| . | 소수점 |

---

### Phase 5: 히스토리 기능

계산 기록 저장 및 표시

**산출물:**
- [ ] HistoryPanel 컴포넌트
- [ ] 히스토리 상태 관리
- [ ] 히스토리 항목 클릭 시 값 불러오기
- [ ] 히스토리 전체 삭제
- [ ] 슬라이드 토글 애니메이션

**히스토리 항목 구조:**
```typescript
interface HistoryEntry {
  id: string;
  expression: string;  // "5 + 3"
  result: string;      // "8"
  timestamp: number;
}
```

---

### Phase 6: 테마 시스템

다크/라이트 모드 구현

**산출물:**
- [ ] ThemeContext 구현
- [ ] CSS 변수 기반 테마 정의
- [ ] ThemeToggle 컴포넌트
- [ ] useLocalStorage로 테마 설정 유지
- [ ] 시스템 테마 감지 (prefers-color-scheme)

**테마 변수:**
```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f5f5f5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --accent: #007bff;
  --button-bg: #e0e0e0;
  --button-hover: #d0d0d0;
}

[data-theme="dark"] {
  --bg-primary: #1e1e1e;
  --bg-secondary: #2d2d2d;
  --text-primary: #ffffff;
  --text-secondary: #b0b0b0;
  --accent: #4dabf7;
  --button-bg: #3d3d3d;
  --button-hover: #4d4d4d;
}
```

---

### Phase 7: 통합 및 테스트

전체 통합 및 테스트 완료

**산출물:**
- [ ] 컴포넌트 통합 테스트
- [ ] 스펙 시나리오 기반 E2E 테스트
- [ ] 접근성 검증 (키보드 네비게이션, 색상 대비, 포커스 표시)
  - [ ] 색상 대비 검증 (WCAG AA 기준)
  - [ ] 포커스 표시 검증
  - [ ] 키보드 탐색 테스트
- [ ] 테스트 커버리지 80% 이상 달성
- [ ] 버그 수정 및 리팩토링

---

## 리스크 분석

| 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|--------|--------|------------|----------|
| 부동소수점 오차 | 중 | 높음 | 표시 시 소수점 반올림 처리 |
| 공학 함수 정밀도 | 중 | 중 | Math 함수 정밀도 테스트 |
| 수식 파싱 복잡도 | 중 | 중 | 단순 재귀 하강 파서로 구현, 복잡한 경우 라이브러리 검토 |
| 키보드 이벤트 충돌 | 낮음 | 중 | 포커스 상태 관리 철저 |
| 브라우저 호환성 | 낮음 | 낮음 | CSS 변수 폴백 설정 |

---

## 테스트 전략

### 단위 테스트
- 계산 함수 (사칙연산, 공학 함수)
- 상태 리듀서 (모든 액션 타입)
- 유틸리티 함수

### 통합 테스트
- 컴포넌트 렌더링
- 사용자 인터랙션 (클릭, 키보드)
- 상태 변화 검증

### 시나리오 테스트
- 스펙의 GIVEN-WHEN-THEN 시나리오 약 45개 모두 테스트
- 에러 케이스 포함

---

## 예상 산출물 요약

| Phase | 주요 파일 | 테스트 |
|-------|----------|--------|
| 1 | 프로젝트 설정, 디렉토리 | - |
| 2 | calculator.ts, scientific.ts, useCalculator.ts | 20+ 케이스 |
| 3 | 6개 컴포넌트 | 렌더링 테스트 |
| 4 | useKeyboard.ts | 키 매핑 테스트 |
| 5 | HistoryPanel.tsx | 3 시나리오 |
| 6 | ThemeContext.tsx, themes.css | 3 시나리오 |
| 7 | 통합 테스트 | 30 시나리오 전체 |
