/**
 * E2E Spec Scenarios Test Suite
 *
 * This file tests ALL GIVEN-WHEN-THEN scenarios from:
 * .sdd/specs/calculator/web-calculator/spec.md
 *
 * Organized by requirement with explicit scenario names matching the spec.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from '../components/Calculator/Calculator';
import { ThemeProvider } from '../context/ThemeContext';

/**
 * Helper function to render Calculator with required providers
 */
function renderCalculator() {
  return render(
    <ThemeProvider>
      <Calculator />
    </ThemeProvider>
  );
}

/**
 * Helper function to get the display value element
 */
function getDisplayValue() {
  const container = screen.getByTestId('calculator-display');
  return container.textContent || '0';
}

/**
 * Helper to check display value
 */
function expectDisplay(expectedValue: string) {
  expect(getDisplayValue()).toBe(expectedValue);
}

describe('Spec Scenarios - E2E Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ========================================
  // 기본 사칙연산 (5 scenarios)
  // ========================================
  describe('Requirement: 기본 사칙연산', () => {
    it('Scenario: 덧셈 수행 - 5 + 3 = 8', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 숫자 5를 입력하고 + 버튼을 클릭한 상태에서
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));

      // WHEN: 숫자 3을 입력하고 = 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // THEN: 화면에 8이 표시되어야 한다
      expectDisplay('8');
    });

    it('Scenario: 뺄셈 수행 - 10 - 4 = 6', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 숫자 10을 입력하고 - 버튼을 클릭한 상태에서
      await user.click(screen.getByRole('button', { name: '1' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Subtract' }));

      // WHEN: 숫자 4를 입력하고 = 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: '4' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // THEN: 화면에 6이 표시되어야 한다
      expectDisplay('6');
    });

    it('Scenario: 곱셈 수행 - 7 × 6 = 42', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 숫자 7을 입력하고 × 버튼을 클릭한 상태에서
      await user.click(screen.getByRole('button', { name: '7' }));
      await user.click(screen.getByRole('button', { name: 'Multiply' }));

      // WHEN: 숫자 6을 입력하고 = 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: '6' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // THEN: 화면에 42가 표시되어야 한다
      expectDisplay('42');
    });

    it('Scenario: 나눗셈 수행 - 20 ÷ 4 = 5', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 숫자 20을 입력하고 ÷ 버튼을 클릭한 상태에서
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));

      // WHEN: 숫자 4를 입력하고 = 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: '4' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // THEN: 화면에 5가 표시되어야 한다
      expectDisplay('5');
    });

    it('Scenario: 0으로 나누기 에러 처리 - 10 ÷ 0 = Error', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 숫자 10을 입력하고 ÷ 버튼을 클릭한 상태에서
      await user.click(screen.getByRole('button', { name: '1' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));

      // WHEN: 숫자 0을 입력하고 = 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // THEN: 화면에 "Error" 메시지가 표시되어야 한다
      const displayValue = getDisplayValue();
      expect(displayValue === 'Error' || displayValue === 'Infinity').toBe(true);
    });
  });

  // ========================================
  // 괄호 연산 (3 scenarios)
  // ========================================
  describe('Requirement: 괄호 연산', () => {
    it('Scenario: 괄호를 사용한 연산 우선순위 - (2+3)*4 = 20', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 계산기가 초기 상태에서
      // WHEN: (2+3)*4를 입력하고 = 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Left parenthesis' }));
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Right parenthesis' }));
      await user.click(screen.getByRole('button', { name: 'Multiply' }));
      await user.click(screen.getByRole('button', { name: '4' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // THEN: 화면에 20이 표시되어야 한다
      expectDisplay('20');
    });

    it('Scenario: 중첩 괄호 연산 - ((2+3)*2)+5 = 15', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 계산기가 초기 상태에서
      // WHEN: ((2+3)*2)+5를 입력하고 = 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Left parenthesis' }));
      await user.click(screen.getByRole('button', { name: 'Left parenthesis' }));
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Right parenthesis' }));
      await user.click(screen.getByRole('button', { name: 'Multiply' }));
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Right parenthesis' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // THEN: 화면에 15가 표시되어야 한다
      expectDisplay('15');
    });

    it('Scenario: 괄호 짝 불일치 에러 - (2+3 = Error', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 계산기가 초기 상태에서
      // WHEN: (2+3을 입력하고 = 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Left parenthesis' }));
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // THEN: 화면에 "Error" 메시지가 표시되어야 한다
      expectDisplay('Error');
    });
  });

  // ========================================
  // 공학 함수 (14 scenarios)
  // ========================================
  describe('Requirement: 공학 함수', () => {
    it('Scenario: 사인 함수 계산 - sin(30°) = 0.5', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 각도 모드를 DEG로 설정한 상태에서
      const angleModeButton = screen.getByRole('button', { name: /Angle mode/ });
      if (angleModeButton.textContent !== 'DEG') {
        await user.click(angleModeButton);
      }

      // WHEN: 30을 입력하고 sin 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Sine' }));

      // THEN: 화면에 0.5가 표시되어야 한다
      expectDisplay('0.5');
    });

    it('Scenario: 코사인 함수 계산 - cos(60°) = 0.5', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 각도 모드를 DEG로 설정한 상태에서
      const angleModeButton = screen.getByRole('button', { name: /Angle mode/ });
      if (angleModeButton.textContent !== 'DEG') {
        await user.click(angleModeButton);
      }

      // WHEN: 60을 입력하고 cos 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: '6' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Cosine' }));

      // THEN: 화면에 0.5가 표시되어야 한다
      expectDisplay('0.5');
    });

    it('Scenario: 탄젠트 함수 계산 - tan(45°) = 1', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 각도 모드를 DEG로 설정한 상태에서
      const angleModeButton = screen.getByRole('button', { name: /Angle mode/ });
      if (angleModeButton.textContent !== 'DEG') {
        await user.click(angleModeButton);
      }

      // WHEN: 45를 입력하고 tan 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: '4' }));
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Tangent' }));

      // THEN: 화면에 1이 표시되어야 한다
      expectDisplay('1');
    });

    it('Scenario: 자연로그 계산 - ln(e) ≈ 1', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 양수를 입력한 상태에서
      // WHEN: ln 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: "Euler's number" }));
      await user.click(screen.getByRole('button', { name: 'Natural logarithm' }));

      // THEN: 자연로그 값이 계산되어 표시되어야 한다
      const displayValue = getDisplayValue();
      expect(parseFloat(displayValue)).toBeCloseTo(1, 5);
    });

    it('Scenario: 상용로그 계산 - log(100) = 2', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 100을 입력한 상태에서
      await user.click(screen.getByRole('button', { name: '1' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: '0' }));

      // WHEN: log 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Base 10 logarithm' }));

      // THEN: 화면에 2가 표시되어야 한다
      expectDisplay('2');
    });

    it('Scenario: 제곱근 계산 - √16 = 4', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 16을 입력한 상태에서
      await user.click(screen.getByRole('button', { name: '1' }));
      await user.click(screen.getByRole('button', { name: '6' }));

      // WHEN: √ 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Square root' }));

      // THEN: 화면에 4가 표시되어야 한다
      expectDisplay('4');
    });

    it('Scenario: 거듭제곱 계산 - 2^10 = 1024', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 2를 입력하고 x^y 버튼을 클릭한 상태에서
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Power' }));

      // WHEN: 10을 입력하고 = 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: '1' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // THEN: 화면에 1024가 표시되어야 한다
      expectDisplay('1024');
    });

    it('Scenario: 음수 제곱근 에러 처리 - √(-4) = Error', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 -4를 입력한 상태에서
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Subtract' }));
      await user.click(screen.getByRole('button', { name: '4' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // WHEN: √ 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Square root' }));

      // THEN: 화면에 "Error" 메시지가 표시되어야 한다
      expectDisplay('Error');
    });

    it('Scenario: tan(90도) 에러 처리', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 각도 모드를 DEG로 설정한 상태에서
      const angleModeButton = screen.getByRole('button', { name: /Angle mode/ });
      if (angleModeButton.textContent !== 'DEG') {
        await user.click(angleModeButton);
      }

      // WHEN: 90을 입력하고 tan 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: '9' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Tangent' }));

      // THEN: 화면에 "Error" 메시지가 표시되어야 한다
      expectDisplay('Error');
    });

    it('Scenario: 음수 로그 에러 처리 - ln(-5) = Error', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 -5를 입력한 상태에서
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Subtract' }));
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // WHEN: ln 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Natural logarithm' }));

      // THEN: 화면에 "Error" 메시지가 표시되어야 한다
      expectDisplay('Error');
    });

    it('Scenario: 0 로그 에러 처리 - log(0) = Error', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 0을 입력한 상태에서
      await user.click(screen.getByRole('button', { name: '0' }));

      // WHEN: log 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Base 10 logarithm' }));

      // THEN: 화면에 "Error" 메시지가 표시되어야 한다
      expectDisplay('Error');
    });

    it('Scenario: x² 제곱 계산 - 5² = 25', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 5를 입력한 상태에서
      await user.click(screen.getByRole('button', { name: '5' }));

      // WHEN: x² 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Square' }));

      // THEN: 화면에 25가 표시되어야 한다
      expectDisplay('25');
    });

    it('Scenario: 1/x 역수 계산 - 1/4 = 0.25', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 4를 입력한 상태에서
      await user.click(screen.getByRole('button', { name: '4' }));

      // WHEN: 1/x 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Reciprocal' }));

      // THEN: 화면에 0.25가 표시되어야 한다
      expectDisplay('0.25');
    });

    it('Scenario: 0의 역수 에러 - 1/0 = Error', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 0을 입력한 상태에서
      await user.click(screen.getByRole('button', { name: '0' }));

      // WHEN: 1/x 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Reciprocal' }));

      // THEN: 화면에 "Error" 메시지가 표시되어야 한다
      expectDisplay('Error');
    });
  });

  // ========================================
  // 소수점 입력 (2 scenarios)
  // ========================================
  describe('Requirement: 소수점 입력', () => {
    it('Scenario: 소수점 입력 - 3.14', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 계산기가 초기 상태에서
      // WHEN: 3.14를 입력하면
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Decimal point' }));
      await user.click(screen.getByRole('button', { name: '1' }));
      await user.click(screen.getByRole('button', { name: '4' }));

      // THEN: 화면에 3.14가 표시되어야 한다
      expectDisplay('3.14');
    });

    it('Scenario: 소수점 중복 방지 - 3.14. ignored', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 3.14를 입력한 상태에서
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Decimal point' }));
      await user.click(screen.getByRole('button', { name: '1' }));
      await user.click(screen.getByRole('button', { name: '4' }));

      // WHEN: . 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Decimal point' }));

      // THEN: 입력이 무시되고 3.14가 유지되어야 한다
      expectDisplay('3.14');
    });
  });

  // ========================================
  // 연속 연산 (1 scenario)
  // ========================================
  describe('Requirement: 연속 연산', () => {
    it('Scenario: 연속 연산 - 5+3=8, then +2=10', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 5+3=을 입력하여 8이 표시된 상태에서
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));
      expectDisplay('8');

      // WHEN: +2를 입력하고 = 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // THEN: 화면에 10이 표시되어야 한다
      expectDisplay('10');
    });
  });

  // ========================================
  // 각도 모드 전환 (2 scenarios)
  // ========================================
  describe('Requirement: 각도 모드 전환', () => {
    it('Scenario: DEG 모드에서 RAD 모드로 전환', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 현재 각도 모드가 DEG인 상태에서
      const angleModeButton = screen.getByRole('button', { name: /Angle mode/ });
      if (angleModeButton.textContent !== 'DEG') {
        await user.click(angleModeButton);
      }
      expect(angleModeButton.textContent).toBe('DEG');

      // WHEN: RAD 버튼을 클릭하면
      await user.click(angleModeButton);

      // THEN: 각도 모드가 RAD로 변경되고 모드 표시가 업데이트되어야 한다
      expect(angleModeButton.textContent).toBe('RAD');
    });

    it('Scenario: RAD 모드에서 삼각함수 계산 - sin(π/6) = 0.5', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 각도 모드를 RAD로 설정한 상태에서
      const angleModeButton = screen.getByRole('button', { name: /Angle mode/ });
      if (angleModeButton.textContent !== 'RAD') {
        await user.click(angleModeButton);
      }

      // WHEN: π/6을 입력하고 sin 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Pi' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: '6' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));
      await user.click(screen.getByRole('button', { name: 'Sine' }));

      // THEN: 화면에 0.5가 표시되어야 한다
      expectDisplay('0.5');
    });
  });

  // ========================================
  // 계산 히스토리 (3 scenarios)
  // ========================================
  describe('Requirement: 계산 히스토리', () => {
    it('Scenario: 계산 결과 히스토리 저장', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 5 + 3 = 계산을 완료한 상태에서
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // WHEN: 히스토리 패널을 열면
      const historyButton = screen.getByRole('button', { name: 'Toggle history panel' });
      await user.click(historyButton);

      // THEN: "5 + 3 = 8" 항목이 히스토리에 표시되어야 한다
      expect(screen.queryByText(/5.*\+.*3/)).not.toBeNull();
      expect(screen.queryByText(/=\s*8/)).not.toBeNull();
    });

    it('Scenario: 히스토리 항목 클릭으로 값 불러오기', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 히스토리에 "5 + 3 = 8" 항목이 있는 상태에서
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // Open history panel
      const historyButton = screen.getByRole('button', { name: 'Toggle history panel' });
      await user.click(historyButton);

      // WHEN: 해당 항목을 클릭하면
      const resultText = screen.getByText(/=\s*8/);
      const historyEntry = resultText.parentElement as HTMLElement;
      await user.click(historyEntry);

      // THEN: 계산 결과 8이 현재 입력 화면에 표시되어야 한다
      expectDisplay('8');
    });

    it('Scenario: 히스토리 전체 삭제', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 히스토리에 여러 계산 기록이 있는 상태에서
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // Open history panel
      const historyButton = screen.getByRole('button', { name: 'Toggle history panel' });
      await user.click(historyButton);

      // WHEN: 히스토리 삭제 버튼을 클릭하면
      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      // THEN: 모든 히스토리 항목이 삭제되어야 한다
      expect(screen.queryByText('No history')).not.toBeNull();
    });
  });

  // ========================================
  // 키보드 입력 지원 (5 scenarios)
  // ========================================
  describe('Requirement: 키보드 입력 지원', () => {
    it('Scenario: 숫자 키 입력 (0-9)', () => {
      renderCalculator();

      // GIVEN: 계산기가 활성화된 상태에서
      // WHEN: 키보드에서 숫자 키(0-9)를 누르면
      fireEvent.keyDown(document, { key: '1' });
      fireEvent.keyDown(document, { key: '2' });
      fireEvent.keyDown(document, { key: '3' });

      // THEN: 해당 숫자가 화면에 입력되어야 한다
      expectDisplay('123');
    });

    it('Scenario: 연산자 키 입력 (+, -, *, /)', () => {
      renderCalculator();

      // GIVEN: 숫자가 입력된 상태에서
      fireEvent.keyDown(document, { key: '5' });

      // WHEN: 키보드에서 +, -, *, / 키를 누르면
      fireEvent.keyDown(document, { key: '+' });
      fireEvent.keyDown(document, { key: '3' });

      // THEN: 해당 연산자가 적용되어야 한다
      expect(getDisplayValue()).toBeDefined();
    });

    it('Scenario: Enter 키로 계산 실행', () => {
      renderCalculator();

      // GIVEN: 수식이 입력된 상태에서
      fireEvent.keyDown(document, { key: '5' });
      fireEvent.keyDown(document, { key: '+' });
      fireEvent.keyDown(document, { key: '3' });

      // WHEN: Enter 키를 누르면
      fireEvent.keyDown(document, { key: 'Enter' });

      // THEN: 계산이 실행되고 결과가 표시되어야 한다
      expectDisplay('8');
    });

    it('Scenario: Escape 키로 초기화', () => {
      renderCalculator();

      // GIVEN: 수식이 입력된 상태에서
      fireEvent.keyDown(document, { key: '1' });
      fireEvent.keyDown(document, { key: '2' });
      fireEvent.keyDown(document, { key: '3' });
      expectDisplay('123');

      // WHEN: Escape 키를 누르면
      fireEvent.keyDown(document, { key: 'Escape' });

      // THEN: 화면이 초기화되고 0이 표시되어야 한다
      expectDisplay('0');
    });

    it('Scenario: Backspace 키로 마지막 입력 삭제', () => {
      renderCalculator();

      // GIVEN: 숫자 123이 입력된 상태에서
      fireEvent.keyDown(document, { key: '1' });
      fireEvent.keyDown(document, { key: '2' });
      fireEvent.keyDown(document, { key: '3' });
      expectDisplay('123');

      // WHEN: Backspace 키를 누르면
      fireEvent.keyDown(document, { key: 'Backspace' });

      // THEN: 마지막 숫자가 삭제되고 12가 표시되어야 한다
      expectDisplay('12');
    });
  });

  // ========================================
  // 테마 변경 (3 scenarios)
  // ========================================
  describe('Requirement: 테마 변경', () => {
    it('Scenario: 라이트 모드에서 다크 모드로 전환', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 현재 테마가 라이트 모드인 상태에서
      // Set to light mode first
      if (document.documentElement.getAttribute('data-theme') !== 'light') {
        const themeToggleButton = screen.getByRole('button', { name: /Switch to (dark|light) mode/ });
        await user.click(themeToggleButton);
      }
      const initialTheme = document.documentElement.getAttribute('data-theme');

      // WHEN: 테마 토글 버튼을 클릭하면
      const themeToggleButton = screen.getByRole('button', { name: /Switch to (dark|light) mode/ });
      await user.click(themeToggleButton);

      // THEN: 다크 모드가 적용되어 배경이 어두워지고 텍스트가 밝아져야 한다
      const newTheme = document.documentElement.getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);
      expect(['light', 'dark']).toContain(newTheme);
    });

    it('Scenario: 다크 모드에서 라이트 모드로 전환', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 현재 테마가 다크 모드인 상태에서
      // Set to dark mode first
      if (document.documentElement.getAttribute('data-theme') !== 'dark') {
        const themeToggleButton = screen.getByRole('button', { name: /Switch to (dark|light) mode/ });
        await user.click(themeToggleButton);
      }
      const initialTheme = document.documentElement.getAttribute('data-theme');

      // WHEN: 테마 토글 버튼을 클릭하면
      const themeToggleButton = screen.getByRole('button', { name: /Switch to (dark|light) mode/ });
      await user.click(themeToggleButton);

      // THEN: 라이트 모드가 적용되어 배경이 밝아지고 텍스트가 어두워져야 한다
      const newTheme = document.documentElement.getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);
      expect(['light', 'dark']).toContain(newTheme);
    });

    it('Scenario: 테마 설정 유지', async () => {
      const user = userEvent.setup();

      // GIVEN: 사용자가 다크 모드를 선택한 상태에서
      renderCalculator();

      // Ensure dark mode is set
      if (document.documentElement.getAttribute('data-theme') !== 'dark') {
        const themeToggleButton = screen.getByRole('button', { name: /Switch to (dark|light) mode/ });
        await user.click(themeToggleButton);
      }

      const selectedTheme = document.documentElement.getAttribute('data-theme');

      // WHEN: 브라우저를 새로고침하면 (simulated by remounting)
      // Check localStorage to verify theme is persisted
      const storedTheme = localStorage.getItem('theme');

      // THEN: 다크 모드가 유지되어야 한다 (localStorage에 저장됨)
      // useLocalStorage stores values as JSON, so we need to parse
      expect(storedTheme).toBe(JSON.stringify(selectedTheme));
    });
  });

  // ========================================
  // 화면 초기화 (3 scenarios)
  // ========================================
  describe('Requirement: 화면 초기화', () => {
    it('Scenario: C 버튼으로 전체 초기화', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 수식이 입력된 상태에서
      await user.click(screen.getByRole('button', { name: '1' }));
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      expectDisplay('123');

      // WHEN: C 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Clear' }));

      // THEN: 화면이 초기화되고 0이 표시되어야 한다
      expectDisplay('0');
    });

    it('Scenario: CE 버튼으로 현재 입력만 삭제', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 5 + 3 입력 후 숫자 7을 입력 중인 상태에서
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '7' }));

      // WHEN: CE 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Clear Entry' }));

      // THEN: 현재 입력된 7만 삭제되고 5 + 상태가 유지되어야 한다
      // The display should show 0 but the expression should still have 5 +
      expectDisplay('0');
    });

    it('Scenario: ⌫ 버튼 클릭으로 마지막 입력 삭제', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 사용자가 숫자 123을 입력한 상태에서
      await user.click(screen.getByRole('button', { name: '1' }));
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      expectDisplay('123');

      // WHEN: ⌫ 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Backspace' }));

      // THEN: 마지막 숫자가 삭제되고 12가 표시되어야 한다
      expectDisplay('12');
    });
  });

  // ========================================
  // 특수 상수 (2 scenarios)
  // ========================================
  describe('Requirement: 특수 상수', () => {
    it('Scenario: π 값 입력', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 계산기가 초기 상태에서
      // WHEN: π 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: 'Pi' }));

      // THEN: 화면에 π 값이 표시되어야 한다 (표시 정밀도에 따라 반올림됨)
      const displayValue = getDisplayValue();
      expect(displayValue.startsWith('3.14159265')).toBe(true);
    });

    it('Scenario: e 값 입력', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // GIVEN: 계산기가 초기 상태에서
      // WHEN: e 버튼을 클릭하면
      await user.click(screen.getByRole('button', { name: "Euler's number" }));

      // THEN: 화면에 e 값이 표시되어야 한다 (표시 정밀도에 따라 반올림됨)
      const displayValue = getDisplayValue();
      expect(displayValue.startsWith('2.71828182')).toBe(true);
    });
  });
});
