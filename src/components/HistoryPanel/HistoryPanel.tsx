import { useCalculatorContext } from '../../context/CalculatorContext';
import styles from './HistoryPanel.module.css';

interface HistoryPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * History panel component that displays calculation history
 * Allows users to view past calculations and reload results
 */
export function HistoryPanel({ isOpen, onToggle }: HistoryPanelProps) {
  const { state, dispatch } = useCalculatorContext();

  const handleHistoryClick = (result: string) => {
    dispatch({ type: 'LOAD_FROM_HISTORY', payload: result });
  };

  const handleClearHistory = () => {
    dispatch({ type: 'CLEAR_HISTORY' });
  };

  return (
    <div className={`${styles.historyPanel} ${isOpen ? styles.open : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>History</h3>
        <button
          className={styles.closeButton}
          onClick={onToggle}
          aria-label="Close history panel"
        >
          ×
        </button>
      </div>

      <div className={styles.historyList}>
        {state.history.length === 0 ? (
          <div className={styles.emptyMessage}>No history</div>
        ) : (
          <>
            {state.history.map((entry) => (
              <div
                key={entry.id}
                className={styles.historyItem}
                onClick={() => handleHistoryClick(entry.result)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleHistoryClick(entry.result);
                  }
                }}
              >
                <div className={styles.expression}>{entry.expression}</div>
                <div className={styles.result}>= {entry.result}</div>
              </div>
            ))}
          </>
        )}
      </div>

      {state.history.length > 0 && (
        <div className={styles.footer}>
          <button
            className={styles.clearButton}
            onClick={handleClearHistory}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
