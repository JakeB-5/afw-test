import { useMemo } from 'react';
import styles from './Display.module.css';

interface DisplayProps {
  value: string;
  expression: string;
  error: string | null;
  angleMode: 'DEG' | 'RAD';
}

export function Display({ value, expression, error, angleMode }: DisplayProps) {
  // Calculate font size based on value length to handle long numbers
  const valueFontSize = useMemo(() => {
    const length = (error || value).length;
    if (length > 12) return 'var(--font-size-xl)';
    if (length > 10) return 'var(--font-size-2xl)';
    return 'var(--font-size-display)';
  }, [value, error]);

  // Determine what to display in the main value area
  const displayValue = error || value;
  const hasError = error !== null;

  return (
    <div className={styles.container}>
      {/* Angle mode indicator */}
      <div className={styles.angleMode}>
        {angleMode}
      </div>

      {/* Expression display - shows calculation history/current expression */}
      <div className={styles.expression}>
        {expression || '\u00A0'} {/* non-breaking space when empty */}
      </div>

      {/* Main value display */}
      <div
        className={`${styles.value} ${hasError ? styles.error : ''}`}
        style={{ fontSize: valueFontSize }}
        data-testid="calculator-display"
      >
        {displayValue}
      </div>
    </div>
  );
}
