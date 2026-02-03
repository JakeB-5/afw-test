import React from 'react';
import Button from '../Button';
import { useCalculatorContext } from '../../context/CalculatorContext';
import styles from './Keypad.module.css';

const Keypad: React.FC = () => {
  const { dispatch } = useCalculatorContext();

  // Number buttons (0-9)
  const handleDigit = (digit: string) => {
    dispatch({ type: 'DIGIT', payload: digit });
  };

  // Decimal point
  const handleDecimal = () => {
    dispatch({ type: 'DECIMAL' });
  };

  // Operator buttons (+, -, ×, ÷)
  const handleOperator = (operator: '+' | '-' | '*' | '/') => {
    dispatch({ type: 'OPERATOR', payload: operator });
  };

  // Equals button
  const handleEquals = () => {
    dispatch({ type: 'EQUALS' });
  };

  // Control buttons (C, CE, ⌫)
  const handleClear = () => {
    dispatch({ type: 'CLEAR' });
  };

  const handleClearEntry = () => {
    dispatch({ type: 'CLEAR_ENTRY' });
  };

  const handleBackspace = () => {
    dispatch({ type: 'BACKSPACE' });
  };

  return (
    <div className={styles.keypad}>
      {/* Control buttons row */}
      <Button variant="control" onClick={handleClearEntry} ariaLabel="Clear Entry">
        CE
      </Button>
      <Button variant="control" onClick={handleClear} ariaLabel="Clear">
        C
      </Button>
      <Button variant="control" onClick={handleBackspace} ariaLabel="Backspace">
        ⌫
      </Button>
      <Button variant="operator" onClick={() => handleOperator('/')} ariaLabel="Divide">
        ÷
      </Button>

      {/* Number pad rows */}
      <Button variant="number" onClick={() => handleDigit('7')}>
        7
      </Button>
      <Button variant="number" onClick={() => handleDigit('8')}>
        8
      </Button>
      <Button variant="number" onClick={() => handleDigit('9')}>
        9
      </Button>
      <Button variant="operator" onClick={() => handleOperator('*')} ariaLabel="Multiply">
        ×
      </Button>

      <Button variant="number" onClick={() => handleDigit('4')}>
        4
      </Button>
      <Button variant="number" onClick={() => handleDigit('5')}>
        5
      </Button>
      <Button variant="number" onClick={() => handleDigit('6')}>
        6
      </Button>
      <Button variant="operator" onClick={() => handleOperator('-')} ariaLabel="Subtract">
        -
      </Button>

      <Button variant="number" onClick={() => handleDigit('1')}>
        1
      </Button>
      <Button variant="number" onClick={() => handleDigit('2')}>
        2
      </Button>
      <Button variant="number" onClick={() => handleDigit('3')}>
        3
      </Button>
      <Button variant="operator" onClick={() => handleOperator('+')} ariaLabel="Add">
        +
      </Button>

      {/* Bottom row */}
      <Button variant="number" onClick={() => handleDigit('0')} className={styles.zeroButton}>
        0
      </Button>
      <Button variant="number" onClick={handleDecimal} ariaLabel="Decimal point">
        .
      </Button>
      <Button variant="equals" onClick={handleEquals} ariaLabel="Equals">
        =
      </Button>
    </div>
  );
};

export default Keypad;
