import { useEffect } from 'react';
import type { CalculatorAction } from '../types/calculator';

/**
 * Props for useKeyboard hook
 */
interface UseKeyboardProps {
  dispatch: React.Dispatch<CalculatorAction>;
  enabled?: boolean;
}

/**
 * Custom hook that handles keyboard input for the calculator
 * Maps keyboard keys to calculator actions and dispatches them
 *
 * @param dispatch - The dispatch function from calculator context
 * @param enabled - Optional flag to enable/disable keyboard support (default: true)
 */
export function useKeyboard({ dispatch, enabled = true }: UseKeyboardProps) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      // Number keys (0-9)
      if (/^[0-9]$/.test(key)) {
        event.preventDefault();
        dispatch({ type: 'DIGIT', payload: key });
        return;
      }

      // Operator keys
      switch (key) {
        case '+':
          event.preventDefault();
          dispatch({ type: 'OPERATOR', payload: '+' });
          break;

        case '-':
          event.preventDefault();
          dispatch({ type: 'OPERATOR', payload: '-' });
          break;

        case '*':
          event.preventDefault();
          dispatch({ type: 'OPERATOR', payload: '*' });
          break;

        case '/':
          event.preventDefault();
          dispatch({ type: 'OPERATOR', payload: '/' });
          break;

        case '.':
          event.preventDefault();
          dispatch({ type: 'DECIMAL' });
          break;

        case 'Enter':
        case '=':
          event.preventDefault();
          dispatch({ type: 'EQUALS' });
          break;

        case 'Escape':
          event.preventDefault();
          dispatch({ type: 'CLEAR' });
          break;

        case 'Backspace':
          event.preventDefault();
          dispatch({ type: 'BACKSPACE' });
          break;

        case '(':
          event.preventDefault();
          dispatch({ type: 'PARENTHESIS', payload: '(' });
          break;

        case ')':
          event.preventDefault();
          dispatch({ type: 'PARENTHESIS', payload: ')' });
          break;

        default:
          // Ignore other keys
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dispatch, enabled]);
}
