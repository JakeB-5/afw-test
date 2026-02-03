import { useReducer } from 'react';
import type { CalculatorState, CalculatorAction } from '../types/calculator';
import { initialCalculatorState } from '../types/calculator';
import { calculate, formatNumber, isError } from '../utils/calculator';
import { applyScientificOperation } from '../utils/scientific';
import { parseExpression } from '../utils/parser';
import { PI, E, MAX_HISTORY_ITEMS } from '../utils/constants';

/**
 * Calculator reducer function
 * Handles all calculator state transitions based on dispatched actions
 */
export function calculatorReducer(
  state: CalculatorState,
  action: CalculatorAction
): CalculatorState {
  switch (action.type) {
    case 'DIGIT': {
      const digit = action.payload;

      // If waiting for operand or display is '0', replace display
      if (state.waitingForOperand || state.display === '0') {
        return {
          ...state,
          display: digit,
          fullExpression: state.fullExpression + digit,
          waitingForOperand: false,
          error: null,
        };
      }

      // Append digit to display
      return {
        ...state,
        display: state.display + digit,
        fullExpression: state.fullExpression + digit,
        error: null,
      };
    }

    case 'DECIMAL': {
      // Prevent multiple decimals in the same number
      if (state.display.includes('.')) {
        return state;
      }

      // If waiting for operand, start new number with '0.'
      if (state.waitingForOperand) {
        return {
          ...state,
          display: '0.',
          fullExpression: state.fullExpression + '0.',
          waitingForOperand: false,
          error: null,
        };
      }

      // Append decimal point
      return {
        ...state,
        display: state.display + '.',
        fullExpression: state.fullExpression + '.',
        error: null,
      };
    }

    case 'OPERATOR': {
      const operator = action.payload;
      const currentValue = parseFloat(state.display);

      // If there's a previous operation pending, calculate it first
      if (state.operator && state.previousValue !== null && !state.waitingForOperand) {
        const previousValue = parseFloat(state.previousValue);
        const result = calculate(previousValue, currentValue, state.operator);

        if (isError(result)) {
          return {
            ...state,
            display: result,
            error: result,
            operator: null,
            previousValue: null,
            waitingForOperand: true,
          };
        }

        const formatted = formatNumber(result);
        return {
          ...state,
          display: formatted,
          expression: `${formatted} ${operator}`,
          previousValue: formatted,
          operator,
          waitingForOperand: true,
          fullExpression: state.fullExpression + operator,
          error: null,
        };
      }

      // Store the current value and operator
      return {
        ...state,
        expression: `${state.display} ${operator}`,
        previousValue: state.display,
        operator,
        waitingForOperand: true,
        fullExpression: state.fullExpression + operator,
        error: null,
      };
    }

    case 'EQUALS': {
      // Handle expression with parentheses
      if (state.parenthesisCount !== 0 || state.fullExpression.includes('(')) {
        try {
          const result = parseExpression(state.fullExpression);
          const formatted = formatNumber(result);
          const historyEntry = {
            id: Date.now().toString(),
            expression: state.fullExpression,
            result: formatted,
            timestamp: Date.now(),
          };

          return {
            ...state,
            display: formatted,
            expression: '',
            previousValue: null,
            operator: null,
            waitingForOperand: true,
            fullExpression: '',
            parenthesisCount: 0,
            history: [historyEntry, ...state.history].slice(0, MAX_HISTORY_ITEMS),
            error: null,
          };
        } catch {
          return {
            ...state,
            display: 'Error',
            error: 'Error',
            waitingForOperand: true,
          };
        }
      }

      // Handle simple binary operation
      if (!state.operator || state.previousValue === null) {
        return state;
      }

      const previousValue = parseFloat(state.previousValue);
      const currentValue = parseFloat(state.display);
      const result = calculate(previousValue, currentValue, state.operator);

      if (isError(result)) {
        return {
          ...state,
          display: result,
          error: result,
          operator: null,
          previousValue: null,
          waitingForOperand: true,
        };
      }

      const formatted = formatNumber(result);
      const historyEntry = {
        id: Date.now().toString(),
        expression: `${state.previousValue} ${state.operator} ${state.display}`,
        result: formatted,
        timestamp: Date.now(),
      };

      return {
        ...state,
        display: formatted,
        expression: '',
        previousValue: null,
        operator: null,
        waitingForOperand: true,
        fullExpression: '',
        history: [historyEntry, ...state.history].slice(0, MAX_HISTORY_ITEMS),
        error: null,
      };
    }

    case 'CLEAR': {
      return initialCalculatorState;
    }

    case 'CLEAR_ENTRY': {
      return {
        ...state,
        display: '0',
        error: null,
      };
    }

    case 'BACKSPACE': {
      // Can't backspace from '0' or when waiting for operand
      if (state.display === '0' || state.waitingForOperand) {
        return state;
      }

      // Remove last character
      const newDisplay = state.display.slice(0, -1);
      const newFullExpression = state.fullExpression.slice(0, -1);

      return {
        ...state,
        display: newDisplay || '0',
        fullExpression: newFullExpression,
        error: null,
      };
    }

    case 'SCIENTIFIC': {
      const operation = action.payload;
      const currentValue = parseFloat(state.display);
      const result = applyScientificOperation(operation, currentValue, state.angleMode);

      if (isError(result)) {
        return {
          ...state,
          display: result,
          error: result,
          waitingForOperand: true,
        };
      }

      const formatted = formatNumber(result);
      const historyEntry = {
        id: Date.now().toString(),
        expression: `${operation}(${state.display})`,
        result: formatted,
        timestamp: Date.now(),
      };

      return {
        ...state,
        display: formatted,
        waitingForOperand: true,
        history: [historyEntry, ...state.history].slice(0, MAX_HISTORY_ITEMS),
        error: null,
      };
    }

    case 'TOGGLE_ANGLE': {
      return {
        ...state,
        angleMode: state.angleMode === 'DEG' ? 'RAD' : 'DEG',
      };
    }

    case 'CONSTANT': {
      const constant = action.payload === 'PI' ? PI : E;
      const formatted = formatNumber(constant);

      if (state.waitingForOperand || state.display === '0') {
        return {
          ...state,
          display: formatted,
          fullExpression: state.fullExpression + formatted,
          waitingForOperand: false,
          error: null,
        };
      }

      // Replace current display with constant
      return {
        ...state,
        display: formatted,
        fullExpression: state.fullExpression.slice(0, -state.display.length) + formatted,
        error: null,
      };
    }

    case 'PARENTHESIS': {
      const paren = action.payload;

      if (paren === '(') {
        // Opening parenthesis
        if (state.waitingForOperand || state.display === '0') {
          return {
            ...state,
            display: '0',
            fullExpression: state.fullExpression + '(',
            parenthesisCount: state.parenthesisCount + 1,
            waitingForOperand: false,
            error: null,
          };
        }

        return {
          ...state,
          fullExpression: state.fullExpression + '(',
          parenthesisCount: state.parenthesisCount + 1,
          error: null,
        };
      } else {
        // Closing parenthesis
        if (state.parenthesisCount === 0) {
          return state; // Can't close if no open parenthesis
        }

        return {
          ...state,
          fullExpression: state.fullExpression + ')',
          parenthesisCount: state.parenthesisCount - 1,
          waitingForOperand: true,
          error: null,
        };
      }
    }

    case 'ADD_HISTORY': {
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, MAX_HISTORY_ITEMS),
      };
    }

    case 'CLEAR_HISTORY': {
      return {
        ...state,
        history: [],
      };
    }

    case 'LOAD_FROM_HISTORY': {
      return {
        ...state,
        display: action.payload,
        waitingForOperand: true,
        error: null,
      };
    }

    default:
      return state;
  }
}

/**
 * Custom hook for calculator state management
 * Returns the calculator state and dispatch function
 */
export function useCalculatorReducer() {
  return useReducer(calculatorReducer, initialCalculatorState);
}
