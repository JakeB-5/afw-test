import { describe, it, expect } from 'vitest';
import { calculatorReducer } from './useCalculator';
import { initialCalculatorState } from '../types/calculator';
import type { CalculatorState } from '../types/calculator';

describe('calculatorReducer', () => {
  describe('digit input', () => {
    it('should handle single digit input', () => {
      const state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });

      expect(state.display).toBe('5');
      expect(state.fullExpression).toBe('5');
    });

    it('should handle multiple digit input', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '1',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '2',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '3',
      });

      expect(state.display).toBe('123');
      expect(state.fullExpression).toBe('123');
    });

    it('should replace display when waiting for operand', () => {
      const waitingState: CalculatorState = {
        ...initialCalculatorState,
        display: '5',
        waitingForOperand: true,
      };

      const state = calculatorReducer(waitingState, {
        type: 'DIGIT',
        payload: '3',
      });

      expect(state.display).toBe('3');
      expect(state.waitingForOperand).toBe(false);
    });
  });

  describe('decimal input', () => {
    it('should add decimal point', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'DECIMAL',
      });

      expect(state.display).toBe('5.');
    });

    it('should prevent multiple decimal points', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'DECIMAL',
      });
      state = calculatorReducer(state, {
        type: 'DECIMAL',
      });

      expect(state.display).toBe('5.');
    });

    it('should start with 0. when waiting for operand', () => {
      const waitingState: CalculatorState = {
        ...initialCalculatorState,
        waitingForOperand: true,
      };

      const state = calculatorReducer(waitingState, {
        type: 'DECIMAL',
      });

      expect(state.display).toBe('0.');
    });
  });

  describe('basic operations', () => {
    it('should add two numbers (5+3=8)', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '+',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '3',
      });
      state = calculatorReducer(state, {
        type: 'EQUALS',
      });

      expect(state.display).toBe('8');
    });

    it('should subtract two numbers', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '9',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '-',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '4',
      });
      state = calculatorReducer(state, {
        type: 'EQUALS',
      });

      expect(state.display).toBe('5');
    });

    it('should multiply two numbers', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '6',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '*',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '7',
      });
      state = calculatorReducer(state, {
        type: 'EQUALS',
      });

      expect(state.display).toBe('42');
    });

    it('should divide two numbers', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '8',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '/',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '2',
      });
      state = calculatorReducer(state, {
        type: 'EQUALS',
      });

      expect(state.display).toBe('4');
    });

    it('should handle division by zero', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '/',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '0',
      });
      state = calculatorReducer(state, {
        type: 'EQUALS',
      });

      expect(state.display).toBe('Error');
      expect(state.error).toBe('Error');
    });

    it('should chain operations', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '2',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '+',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '3',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '*',
      });

      // Should calculate 2+3=5 first
      expect(state.display).toBe('5');

      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '4',
      });
      state = calculatorReducer(state, {
        type: 'EQUALS',
      });

      // Then 5*4=20
      expect(state.display).toBe('20');
    });
  });

  describe('clear operations', () => {
    it('should clear all state', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '+',
      });
      state = calculatorReducer(state, {
        type: 'CLEAR',
      });

      expect(state).toEqual(initialCalculatorState);
    });

    it('should clear only current entry', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '+',
      });
      const previousValue = state.previousValue;
      const operator = state.operator;

      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '3',
      });
      state = calculatorReducer(state, {
        type: 'CLEAR_ENTRY',
      });

      expect(state.display).toBe('0');
      expect(state.previousValue).toBe(previousValue);
      expect(state.operator).toBe(operator);
    });
  });

  describe('backspace', () => {
    it('should remove last character', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '1',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '2',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '3',
      });
      state = calculatorReducer(state, {
        type: 'BACKSPACE',
      });

      expect(state.display).toBe('12');
    });

    it('should show 0 when all digits removed', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'BACKSPACE',
      });

      expect(state.display).toBe('0');
    });

    it('should not backspace when waiting for operand', () => {
      const waitingState: CalculatorState = {
        ...initialCalculatorState,
        display: '5',
        waitingForOperand: true,
      };

      const state = calculatorReducer(waitingState, {
        type: 'BACKSPACE',
      });

      expect(state.display).toBe('5');
    });
  });

  describe('scientific functions', () => {
    it('should calculate square root', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '9',
      });
      state = calculatorReducer(state, {
        type: 'SCIENTIFIC',
        payload: 'sqrt',
      });

      expect(state.display).toBe('3');
    });

    it('should calculate square', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'SCIENTIFIC',
        payload: 'square',
      });

      expect(state.display).toBe('25');
    });

    it('should calculate reciprocal', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '4',
      });
      state = calculatorReducer(state, {
        type: 'SCIENTIFIC',
        payload: 'reciprocal',
      });

      expect(state.display).toBe('0.25');
    });

    it('should handle sin in DEG mode', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '3',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '0',
      });
      state = calculatorReducer(state, {
        type: 'SCIENTIFIC',
        payload: 'sin',
      });

      expect(state.display).toBe('0.5');
      expect(state.angleMode).toBe('DEG');
    });

    it('should handle negative sqrt error', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '-',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '1',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '0',
      });
      state = calculatorReducer(state, {
        type: 'EQUALS',
      });
      // display should be -5
      state = calculatorReducer(state, {
        type: 'SCIENTIFIC',
        payload: 'sqrt',
      });

      expect(state.display).toBe('Error');
      expect(state.error).toBe('Error');
    });
  });

  describe('angle mode toggle', () => {
    it('should toggle between DEG and RAD', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'TOGGLE_ANGLE',
      });

      expect(state.angleMode).toBe('RAD');

      state = calculatorReducer(state, {
        type: 'TOGGLE_ANGLE',
      });

      expect(state.angleMode).toBe('DEG');
    });
  });

  describe('constants', () => {
    it('should insert PI constant', () => {
      const state = calculatorReducer(initialCalculatorState, {
        type: 'CONSTANT',
        payload: 'PI',
      });

      expect(parseFloat(state.display)).toBeCloseTo(Math.PI, 5);
    });

    it('should insert E constant', () => {
      const state = calculatorReducer(initialCalculatorState, {
        type: 'CONSTANT',
        payload: 'E',
      });

      expect(parseFloat(state.display)).toBeCloseTo(Math.E, 5);
    });
  });

  describe('parentheses', () => {
    it('should track parenthesis count', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'PARENTHESIS',
        payload: '(',
      });

      expect(state.parenthesisCount).toBe(1);

      state = calculatorReducer(state, {
        type: 'PARENTHESIS',
        payload: '(',
      });

      expect(state.parenthesisCount).toBe(2);

      state = calculatorReducer(state, {
        type: 'PARENTHESIS',
        payload: ')',
      });

      expect(state.parenthesisCount).toBe(1);
    });

    it('should not close when no open parenthesis', () => {
      const state = calculatorReducer(initialCalculatorState, {
        type: 'PARENTHESIS',
        payload: ')',
      });

      expect(state.parenthesisCount).toBe(0);
    });

    it('should evaluate expression with parentheses', () => {
      // (2+3)*4 = 20
      let state = calculatorReducer(initialCalculatorState, {
        type: 'PARENTHESIS',
        payload: '(',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '2',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '+',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '3',
      });
      state = calculatorReducer(state, {
        type: 'PARENTHESIS',
        payload: ')',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '*',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '4',
      });
      state = calculatorReducer(state, {
        type: 'EQUALS',
      });

      expect(state.display).toBe('20');
      expect(state.parenthesisCount).toBe(0);
    });
  });

  describe('history operations', () => {
    it('should add entry to history on equals', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '+',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '3',
      });
      state = calculatorReducer(state, {
        type: 'EQUALS',
      });

      expect(state.history).toHaveLength(1);
      expect(state.history[0].expression).toBe('5 + 3');
      expect(state.history[0].result).toBe('8');
    });

    it('should clear history', () => {
      let state = calculatorReducer(initialCalculatorState, {
        type: 'DIGIT',
        payload: '5',
      });
      state = calculatorReducer(state, {
        type: 'OPERATOR',
        payload: '+',
      });
      state = calculatorReducer(state, {
        type: 'DIGIT',
        payload: '3',
      });
      state = calculatorReducer(state, {
        type: 'EQUALS',
      });

      expect(state.history).toHaveLength(1);

      state = calculatorReducer(state, {
        type: 'CLEAR_HISTORY',
      });

      expect(state.history).toHaveLength(0);
    });

    it('should load value from history', () => {
      const state = calculatorReducer(initialCalculatorState, {
        type: 'LOAD_FROM_HISTORY',
        payload: '42',
      });

      expect(state.display).toBe('42');
      expect(state.waitingForOperand).toBe(true);
    });

    it('should limit history to MAX_HISTORY_ITEMS', () => {
      let state = initialCalculatorState;

      // Add 60 entries (more than MAX_HISTORY_ITEMS which is 50)
      for (let i = 0; i < 60; i++) {
        state = calculatorReducer(state, {
          type: 'DIGIT',
          payload: '1',
        });
        state = calculatorReducer(state, {
          type: 'OPERATOR',
          payload: '+',
        });
        state = calculatorReducer(state, {
          type: 'DIGIT',
          payload: '1',
        });
        state = calculatorReducer(state, {
          type: 'EQUALS',
        });
      }

      expect(state.history).toHaveLength(50);
    });
  });
});
