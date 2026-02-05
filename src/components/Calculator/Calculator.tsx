import { useState } from 'react';
import { CalculatorProvider, useCalculatorContext } from '../../context/CalculatorContext';
import { Display } from '../Display';
import ScientificPanel from '../ScientificPanel';
import Keypad from '../Keypad';
import { ThemeToggle } from '../ThemeToggle';
import { HistoryPanel } from '../HistoryPanel';
import { useKeyboard } from '../../hooks/useKeyboard';
import styles from './Calculator.module.css';

/**
 * Inner component that uses calculator context
 * This needs to be separate so it can access the context provided by CalculatorProvider
 */
function CalculatorContent() {
  const { state, dispatch } = useCalculatorContext();
  const [historyOpen, setHistoryOpen] = useState(false);

  // Enable keyboard support
  useKeyboard({ dispatch });

  const toggleHistory = () => {
    setHistoryOpen(prev => !prev);
  };

  return (
    <>
      <div className={styles.calculator}>
        <div className={styles.themeToggleContainer}>
          <ThemeToggle />
        </div>
        <div className={styles.historyToggleContainer}>
          <button
            className={styles.historyButton}
            onClick={toggleHistory}
            aria-label="Toggle history panel"
            title="History"
          >
            <svg
              className={styles.icon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
        </div>
        <Display
          value={state.display}
          expression={state.expression}
          error={state.error}
          angleMode={state.angleMode}
        />
        <ScientificPanel />
        <Keypad />
      </div>
      <HistoryPanel isOpen={historyOpen} onToggle={toggleHistory} />
    </>
  );
}

/**
 * Main Calculator component
 * Wraps the calculator content with CalculatorProvider for state management
 */
export function Calculator() {
  return (
    <CalculatorProvider>
      <CalculatorContent />
    </CalculatorProvider>
  );
}
