import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { HistoryPanel } from './HistoryPanel';
import { ThemeProvider } from '../../context/ThemeContext';
import { CalculatorProvider } from '../../context/CalculatorContext';
import { useCalculatorContext } from '../../context/CalculatorContext';

/**
 * Helper function to render HistoryPanel with required providers
 */
function renderHistoryPanel(isOpen = true, onToggle = vi.fn()) {
  return render(
    <ThemeProvider>
      <CalculatorProvider>
        <HistoryPanel isOpen={isOpen} onToggle={onToggle} />
      </CalculatorProvider>
    </ThemeProvider>
  );
}

/**
 * Test component that allows us to manipulate calculator context and render HistoryPanel
 */
function TestWrapper({
  isOpen,
  onToggle,
  performCalculations = false,
}: {
  isOpen: boolean;
  onToggle: () => void;
  performCalculations?: boolean;
}) {
  const { dispatch } = useCalculatorContext();

  // Perform some test calculations to populate history (only once on mount)
  useEffect(() => {
    if (performCalculations) {
      // Add 5 + 3 = 8
      dispatch({ type: 'ADD_HISTORY', payload: {
        id: '1',
        expression: '5 + 3',
        result: '8',
        timestamp: Date.now() - 3000,
      }});

      // Add 10 - 2 = 8
      dispatch({ type: 'ADD_HISTORY', payload: {
        id: '2',
        expression: '10 - 2',
        result: '8',
        timestamp: Date.now() - 2000,
      }});

      // Add 6 * 7 = 42
      dispatch({ type: 'ADD_HISTORY', payload: {
        id: '3',
        expression: '6 * 7',
        result: '42',
        timestamp: Date.now() - 1000,
      }});
    }
  }, [performCalculations, dispatch]);

  return <HistoryPanel isOpen={isOpen} onToggle={onToggle} />;
}

function renderWithHistory(isOpen = true, onToggle = vi.fn()) {
  return render(
    <ThemeProvider>
      <CalculatorProvider>
        <TestWrapper isOpen={isOpen} onToggle={onToggle} performCalculations={true} />
      </CalculatorProvider>
    </ThemeProvider>
  );
}

describe('HistoryPanel', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const mockToggle = vi.fn();
      renderHistoryPanel(true, mockToggle);

      expect(screen.getByText('History')).toBeInTheDocument();
    });

    it('renders correctly when closed (not visible or hidden)', () => {
      const mockToggle = vi.fn();
      const { container } = renderHistoryPanel(false, mockToggle);

      // Panel should not have 'open' class when closed
      const panel = container.querySelector('[class*="historyPanel"]');
      expect(panel).toBeInTheDocument();
      expect(panel?.className).not.toContain('open');
    });

    it('renders correctly when open (visible)', () => {
      const mockToggle = vi.fn();
      const { container } = renderHistoryPanel(true, mockToggle);

      // Panel should have 'open' class when open
      const panel = container.querySelector('[class*="historyPanel"]');
      expect(panel).toBeInTheDocument();
      expect(panel?.className).toContain('open');
    });

    it('shows "No history" message when history is empty', () => {
      const mockToggle = vi.fn();
      renderHistoryPanel(true, mockToggle);

      expect(screen.getByText('No history')).toBeInTheDocument();
    });

    it('does not show "No history" when history has entries', () => {
      const mockToggle = vi.fn();
      renderWithHistory(true, mockToggle);

      expect(screen.queryByText('No history')).not.toBeInTheDocument();
    });

    it('displays history entries correctly', () => {
      const mockToggle = vi.fn();
      renderWithHistory(true, mockToggle);

      // Check if all history entries are displayed
      expect(screen.getByText('5 + 3')).toBeInTheDocument();
      expect(screen.getByText('10 - 2')).toBeInTheDocument();
      expect(screen.getByText('6 * 7')).toBeInTheDocument();
      expect(screen.getByText('= 42')).toBeInTheDocument();

      // There are multiple "= 8" entries, so use getAllByText
      const resultEights = screen.getAllByText('= 8');
      expect(resultEights.length).toBe(2);
    });
  });

  describe('History Entry Interactions', () => {
    it('click on history entry loads value to display', async () => {
      const user = userEvent.setup();
      const mockToggle = vi.fn();

      // Render a wrapper that gives us access to both the panel and context
      function TestComponent() {
        const { state, dispatch } = useCalculatorContext();

        // Add a history entry (only once on mount)
        useEffect(() => {
          if (state.history.length === 0) {
            dispatch({ type: 'ADD_HISTORY', payload: {
              id: '1',
              expression: '5 + 3',
              result: '8',
              timestamp: Date.now(),
            }});
          }
        }, [state.history.length, dispatch]);

        return (
          <div>
            <div data-testid="display">{state.display}</div>
            <HistoryPanel isOpen={true} onToggle={mockToggle} />
          </div>
        );
      }

      render(
        <ThemeProvider>
          <CalculatorProvider>
            <TestComponent />
          </CalculatorProvider>
        </ThemeProvider>
      );

      // Click on the history entry
      const historyItem = screen.getByText('5 + 3');
      await user.click(historyItem);

      // Check if display was updated
      const display = screen.getByTestId('display');
      expect(display.textContent).toBe('8');
    });

    it('history entry is accessible via keyboard (Enter)', async () => {
      const mockToggle = vi.fn();

      function TestComponent() {
        const { state, dispatch } = useCalculatorContext();

        useEffect(() => {
          if (state.history.length === 0) {
            dispatch({ type: 'ADD_HISTORY', payload: {
              id: '1',
              expression: '2 * 5',
              result: '10',
              timestamp: Date.now(),
            }});
          }
        }, [state.history.length, dispatch]);

        return (
          <div>
            <div data-testid="display">{state.display}</div>
            <HistoryPanel isOpen={true} onToggle={mockToggle} />
          </div>
        );
      }

      render(
        <ThemeProvider>
          <CalculatorProvider>
            <TestComponent />
          </CalculatorProvider>
        </ThemeProvider>
      );

      // Press Enter on history entry
      const historyItem = screen.getByText('2 * 5');
      fireEvent.keyDown(historyItem, { key: 'Enter' });

      // Check if display was updated
      const display = screen.getByTestId('display');
      expect(display.textContent).toBe('10');
    });

    it('history entry is accessible via keyboard (Space)', async () => {
      const mockToggle = vi.fn();

      function TestComponent() {
        const { state, dispatch } = useCalculatorContext();

        useEffect(() => {
          if (state.history.length === 0) {
            dispatch({ type: 'ADD_HISTORY', payload: {
              id: '1',
              expression: '15 / 3',
              result: '5',
              timestamp: Date.now(),
            }});
          }
        }, [state.history.length, dispatch]);

        return (
          <div>
            <div data-testid="display">{state.display}</div>
            <HistoryPanel isOpen={true} onToggle={mockToggle} />
          </div>
        );
      }

      render(
        <ThemeProvider>
          <CalculatorProvider>
            <TestComponent />
          </CalculatorProvider>
        </ThemeProvider>
      );

      // Press Space on history entry
      const historyItem = screen.getByText('15 / 3');
      fireEvent.keyDown(historyItem, { key: ' ' });

      // Check if display was updated
      const display = screen.getByTestId('display');
      expect(display.textContent).toBe('5');
    });
  });

  describe('Clear History Button', () => {
    it('clear history button is not shown when history is empty', () => {
      const mockToggle = vi.fn();
      renderHistoryPanel(true, mockToggle);

      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });

    it('clear history button is shown when history has entries', () => {
      const mockToggle = vi.fn();
      renderWithHistory(true, mockToggle);

      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('clear history button removes all entries', async () => {
      const user = userEvent.setup();
      const mockToggle = vi.fn();
      renderWithHistory(true, mockToggle);

      // Verify history entries exist
      expect(screen.getByText('5 + 3')).toBeInTheDocument();
      expect(screen.getByText('6 * 7')).toBeInTheDocument();

      // Click clear button
      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      // Verify history is cleared
      expect(screen.queryByText('5 + 3')).not.toBeInTheDocument();
      expect(screen.queryByText('6 * 7')).not.toBeInTheDocument();
      expect(screen.getByText('No history')).toBeInTheDocument();
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });
  });

  describe('Close Button', () => {
    it('close button calls onToggle when clicked', async () => {
      const user = userEvent.setup();
      const mockToggle = vi.fn();
      renderHistoryPanel(true, mockToggle);

      const closeButton = screen.getByRole('button', { name: 'Close history panel' });
      await user.click(closeButton);

      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('close button is always present regardless of history state', () => {
      const mockToggle = vi.fn();

      // Test with empty history
      const { unmount } = renderHistoryPanel(true, mockToggle);
      expect(screen.getByRole('button', { name: 'Close history panel' })).toBeInTheDocument();
      unmount();

      // Test with history entries
      renderWithHistory(true, mockToggle);
      expect(screen.getByRole('button', { name: 'Close history panel' })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility attributes on close button', () => {
      const mockToggle = vi.fn();
      renderHistoryPanel(true, mockToggle);

      const closeButton = screen.getByRole('button', { name: 'Close history panel' });
      expect(closeButton).toHaveAttribute('aria-label', 'Close history panel');
    });

    it('history entries have role="button"', () => {
      const mockToggle = vi.fn();
      renderWithHistory(true, mockToggle);

      const historyItems = screen.getAllByRole('button');
      // Filter out the close button and clear button
      const historyEntryButtons = historyItems.filter(
        button => !button.getAttribute('aria-label') && button.textContent !== 'Clear All'
      );

      expect(historyEntryButtons.length).toBeGreaterThan(0);
    });

    it('history entries have tabIndex={0} for keyboard navigation', () => {
      const mockToggle = vi.fn();
      const { container } = renderWithHistory(true, mockToggle);

      // Find history item elements (they have role="button" and contain expressions)
      const historyItems = container.querySelectorAll('[role="button"][tabindex="0"]');

      // Should have 3 history items (excluding clear and close buttons)
      expect(historyItems.length).toBeGreaterThanOrEqual(3);
    });

    it('panel header has proper title element', () => {
      const mockToggle = vi.fn();
      renderHistoryPanel(true, mockToggle);

      const title = screen.getByText('History');
      expect(title.tagName).toBe('H3');
    });
  });

  describe('Multiple History Entries', () => {
    it('displays multiple history entries in correct order (newest first)', () => {
      const mockToggle = vi.fn();
      const { container } = renderWithHistory(true, mockToggle);

      const historyItems = container.querySelectorAll('[class*="historyItem"]');
      expect(historyItems.length).toBe(3);

      // Newest entry should be first (6 * 7)
      expect(historyItems[0].textContent).toContain('6 * 7');
      expect(historyItems[0].textContent).toContain('= 42');

      // Second entry (10 - 2)
      expect(historyItems[1].textContent).toContain('10 - 2');
      expect(historyItems[1].textContent).toContain('= 8');

      // Oldest entry should be last (5 + 3)
      expect(historyItems[2].textContent).toContain('5 + 3');
      expect(historyItems[2].textContent).toContain('= 8');
    });

    it('shows expression and result separately in each entry', () => {
      const mockToggle = vi.fn();
      const { container } = renderWithHistory(true, mockToggle);

      // Check first entry structure
      const firstEntry = container.querySelector('[class*="historyItem"]');
      const expression = firstEntry?.querySelector('[class*="expression"]');
      const result = firstEntry?.querySelector('[class*="result"]');

      expect(expression).toBeInTheDocument();
      expect(result).toBeInTheDocument();
      expect(expression?.textContent).toBe('6 * 7');
      expect(result?.textContent).toBe('= 42');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty expression gracefully', () => {
      const mockToggle = vi.fn();

      function TestComponent() {
        const { dispatch } = useCalculatorContext();

        useEffect(() => {
          dispatch({ type: 'ADD_HISTORY', payload: {
            id: '1',
            expression: '',
            result: '0',
            timestamp: Date.now(),
          }});
        }, [dispatch]);

        return <HistoryPanel isOpen={true} onToggle={mockToggle} />;
      }

      render(
        <ThemeProvider>
          <CalculatorProvider>
            <TestComponent />
          </CalculatorProvider>
        </ThemeProvider>
      );

      // Should render without crashing
      expect(screen.getByText('= 0')).toBeInTheDocument();
    });

    it('handles long expressions gracefully', () => {
      const mockToggle = vi.fn();

      function TestComponent() {
        const { dispatch } = useCalculatorContext();

        useEffect(() => {
          dispatch({ type: 'ADD_HISTORY', payload: {
            id: '1',
            expression: '123456789 + 987654321',
            result: '1111111110',
            timestamp: Date.now(),
          }});
        }, [dispatch]);

        return <HistoryPanel isOpen={true} onToggle={mockToggle} />;
      }

      render(
        <ThemeProvider>
          <CalculatorProvider>
            <TestComponent />
          </CalculatorProvider>
        </ThemeProvider>
      );

      expect(screen.getByText('123456789 + 987654321')).toBeInTheDocument();
      expect(screen.getByText('= 1111111110')).toBeInTheDocument();
    });
  });
});
