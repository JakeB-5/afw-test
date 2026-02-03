import React from 'react';
import Button from '../Button';
import { useCalculatorContext } from '../../context/CalculatorContext';
import styles from './ScientificPanel.module.css';

const ScientificPanel: React.FC = () => {
  const { state, dispatch } = useCalculatorContext();

  // Scientific function handlers (unary operations)
  const handleScientific = (func: 'sin' | 'cos' | 'tan' | 'ln' | 'log' | 'sqrt' | 'square' | 'reciprocal') => {
    dispatch({ type: 'SCIENTIFIC', payload: func });
  };

  // Power is a binary operator
  const handlePower = () => {
    dispatch({ type: 'OPERATOR', payload: '^' });
  };

  // Constant handlers
  const handleConstant = (constant: 'PI' | 'E') => {
    dispatch({ type: 'CONSTANT', payload: constant });
  };

  // Parenthesis handlers
  const handleParenthesis = (paren: '(' | ')') => {
    dispatch({ type: 'PARENTHESIS', payload: paren });
  };

  // Angle mode toggle
  const handleToggleAngle = () => {
    dispatch({ type: 'TOGGLE_ANGLE' });
  };

  return (
    <div className={styles.scientificPanel}>
      {/* Angle mode toggle */}
      <Button
        variant="function"
        onClick={handleToggleAngle}
        ariaLabel={`Angle mode: ${state.angleMode}`}
        className={styles.angleModeButton}
      >
        {state.angleMode}
      </Button>

      {/* Parentheses */}
      <Button variant="scientific" onClick={() => handleParenthesis('(')} ariaLabel="Left parenthesis">
        (
      </Button>
      <Button variant="scientific" onClick={() => handleParenthesis(')')} ariaLabel="Right parenthesis">
        )
      </Button>

      {/* Constants */}
      <Button variant="scientific" onClick={() => handleConstant('PI')} ariaLabel="Pi">
        π
      </Button>
      <Button variant="scientific" onClick={() => handleConstant('E')} ariaLabel="Euler's number">
        e
      </Button>

      {/* Trigonometric functions */}
      <Button variant="scientific" onClick={() => handleScientific('sin')} ariaLabel="Sine">
        sin
      </Button>
      <Button variant="scientific" onClick={() => handleScientific('cos')} ariaLabel="Cosine">
        cos
      </Button>
      <Button variant="scientific" onClick={() => handleScientific('tan')} ariaLabel="Tangent">
        tan
      </Button>

      {/* Logarithmic functions */}
      <Button variant="scientific" onClick={() => handleScientific('ln')} ariaLabel="Natural logarithm">
        ln
      </Button>
      <Button variant="scientific" onClick={() => handleScientific('log')} ariaLabel="Base 10 logarithm">
        log
      </Button>

      {/* Root and power functions */}
      <Button variant="scientific" onClick={() => handleScientific('sqrt')} ariaLabel="Square root">
        √
      </Button>
      <Button variant="scientific" onClick={handlePower} ariaLabel="Power">
        x^y
      </Button>
      <Button variant="scientific" onClick={() => handleScientific('square')} ariaLabel="Square">
        x²
      </Button>

      {/* Reciprocal */}
      <Button variant="scientific" onClick={() => handleScientific('reciprocal')} ariaLabel="Reciprocal">
        1/x
      </Button>
    </div>
  );
};

export default ScientificPanel;
