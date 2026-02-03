---
version: 1.1.0
created: 2026-02-03
updated: 2026-02-03
---

# Constitution: afw-test

> 이 프로젝트의 모든 설계와 구현은 아래 원칙을 준수해야 한다(SHALL).

## 핵심 원칙

### 1. 품질 우선

- 모든 기능은 테스트와 함께 구현해야 한다(SHALL)
- 코드 리뷰 없이 머지해서는 안 된다(SHALL NOT)

### 2. 명세 우선

- 모든 기능은 스펙 문서가 먼저 작성되어야 한다(SHALL)
- 스펙은 RFC 2119 키워드를 사용해야 한다(SHALL)
- 모든 요구사항은 GIVEN-WHEN-THEN 시나리오를 포함해야 한다(SHALL)

## 금지 사항

- 스펙 없이 기능을 구현해서는 안 된다(SHALL NOT)
- 테스트 없이 배포해서는 안 된다(SHALL NOT)

## 기술 스택

### 프론트엔드
- React 18+ (SHALL)
- TypeScript strict 모드 (SHALL)
- CSS Modules 또는 styled-components (SHOULD)

### 빌드 도구
- Vite (SHOULD)

### 테스트
- Vitest (SHALL)
- React Testing Library (SHALL)

## 품질 기준

- 테스트 커버리지: 80% 이상(SHOULD)
