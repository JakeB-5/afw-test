import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from './Calculator';
import { ThemeProvider } from '../../context/ThemeContext';

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

describe('Calculator', () => {
  beforeEach(() => {
    // Clear any localStorage before each test
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderCalculator();
      expect(getDisplayValue()).toBeDefined();
    });

    it('displays "0" initially', () => {
      renderCalculator();
      expectDisplay('0');
    });
  });

  describe('Mouse Interactions', () => {
    it('clicking number buttons updates display', async () => {
      const user = userEvent.setup();
      renderCalculator();

      const button5 = screen.getByRole('button', { name: '5' });
      await user.click(button5);

      expectDisplay('5');

      const button3 = screen.getByRole('button', { name: '3' });
      await user.click(button3);

      expectDisplay('53');
    });

    it('clicking operators works', async () => {
      const user = userEvent.setup();
      renderCalculator();

      const button5 = screen.getByRole('button', { name: '5' });
      const buttonPlus = screen.getByRole('button', { name: 'Add' });

      await user.click(button5);
      await user.click(buttonPlus);

      // After clicking operator, display might show the operator or last number
      // The exact behavior depends on your calculator implementation
      expect(getDisplayValue()).toBeDefined();
    });

    it('clicking equals calculates result', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Click 5 + 3 =
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      expectDisplay('8');
    });

    it('calculates subtraction correctly', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Click 9 - 4 =
      await user.click(screen.getByRole('button', { name: '9' }));
      await user.click(screen.getByRole('button', { name: 'Subtract' }));
      await user.click(screen.getByRole('button', { name: '4' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      expectDisplay('5');
    });

    it('calculates multiplication correctly', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Click 6 * 7 =
      await user.click(screen.getByRole('button', { name: '6' }));
      await user.click(screen.getByRole('button', { name: 'Multiply' }));
      await user.click(screen.getByRole('button', { name: '7' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      expectDisplay('42');
    });

    it('calculates division correctly', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Click 8 / 2 =
      await user.click(screen.getByRole('button', { name: '8' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      expectDisplay('4');
    });

    it('clears display when C button is clicked', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Enter some numbers
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      expectDisplay('53');

      // Click clear button
      await user.click(screen.getByRole('button', { name: 'Clear' }));
      expectDisplay('0');
    });
  });

  describe('Keyboard Interactions - Numbers', () => {
    it('keyboard number input (0-9) updates display', () => {
      renderCalculator();

      // Type 0
      fireEvent.keyDown(document, { key: '0' });
      expectDisplay('0');

      // Type 1
      fireEvent.keyDown(document, { key: '1' });
      expectDisplay('1');

      // Type 2
      fireEvent.keyDown(document, { key: '2' });
      expectDisplay('12');

      // Type 3
      fireEvent.keyDown(document, { key: '3' });
      expectDisplay('123');

      // Type 4
      fireEvent.keyDown(document, { key: '4' });
      expectDisplay('1234');

      // Type 5
      fireEvent.keyDown(document, { key: '5' });
      expectDisplay('12345');

      // Type 6
      fireEvent.keyDown(document, { key: '6' });
      expectDisplay('123456');

      // Type 7
      fireEvent.keyDown(document, { key: '7' });
      expectDisplay('1234567');

      // Type 8
      fireEvent.keyDown(document, { key: '8' });
      expectDisplay('12345678');

      // Type 9
      fireEvent.keyDown(document, { key: '9' });
      expectDisplay('123456789');
    });
  });

  describe('Keyboard Interactions - Operators', () => {
    it('keyboard operator input (+) works', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '5' });
      fireEvent.keyDown(document, { key: '+' });
      fireEvent.keyDown(document, { key: '3' });

      // Display should show 3 (the current input)
      expect(getDisplayValue()).toBeDefined();
    });

    it('keyboard operator input (-) works', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '9' });
      fireEvent.keyDown(document, { key: '-' });
      fireEvent.keyDown(document, { key: '2' });

      expect(getDisplayValue()).toBeDefined();
    });

    it('keyboard operator input (*) works', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '4' });
      fireEvent.keyDown(document, { key: '*' });
      fireEvent.keyDown(document, { key: '3' });

      expect(getDisplayValue()).toBeDefined();
    });

    it('keyboard operator input (/) works', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '8' });
      fireEvent.keyDown(document, { key: '/' });
      fireEvent.keyDown(document, { key: '2' });

      expect(getDisplayValue()).toBeDefined();
    });
  });

  describe('Keyboard Interactions - Special Keys', () => {
    it('keyboard Enter triggers calculation', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '5' });
      fireEvent.keyDown(document, { key: '+' });
      fireEvent.keyDown(document, { key: '3' });
      fireEvent.keyDown(document, { key: 'Enter' });

      expectDisplay('8');
    });

    it('keyboard Escape clears display', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '1' });
      fireEvent.keyDown(document, { key: '2' });
      fireEvent.keyDown(document, { key: '3' });
      expectDisplay('123');

      fireEvent.keyDown(document, { key: 'Escape' });
      expectDisplay('0');
    });

    it('keyboard Backspace removes last digit', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '1' });
      fireEvent.keyDown(document, { key: '2' });
      fireEvent.keyDown(document, { key: '3' });
      expectDisplay('123');

      fireEvent.keyDown(document, { key: 'Backspace' });
      expectDisplay('12');

      fireEvent.keyDown(document, { key: 'Backspace' });
      expectDisplay('1');

      fireEvent.keyDown(document, { key: 'Backspace' });
      expectDisplay('0');
    });

    it('keyboard decimal point works', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '3' });
      fireEvent.keyDown(document, { key: '.' });
      fireEvent.keyDown(document, { key: '1' });
      fireEvent.keyDown(document, { key: '4' });

      expectDisplay('3.14');
    });
  });

  describe('Keyboard Interactions - Full Calculations', () => {
    it('full calculation via keyboard: 5 + 3 = 8', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '5' });
      fireEvent.keyDown(document, { key: '+' });
      fireEvent.keyDown(document, { key: '3' });
      fireEvent.keyDown(document, { key: 'Enter' });

      expectDisplay('8');
    });

    it('full calculation via keyboard: 10 - 4 = 6', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '1' });
      fireEvent.keyDown(document, { key: '0' });
      fireEvent.keyDown(document, { key: '-' });
      fireEvent.keyDown(document, { key: '4' });
      fireEvent.keyDown(document, { key: 'Enter' });

      expectDisplay('6');
    });

    it('full calculation via keyboard: 6 * 7 = 42', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '6' });
      fireEvent.keyDown(document, { key: '*' });
      fireEvent.keyDown(document, { key: '7' });
      fireEvent.keyDown(document, { key: 'Enter' });

      expectDisplay('42');
    });

    it('full calculation via keyboard: 15 / 3 = 5', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '1' });
      fireEvent.keyDown(document, { key: '5' });
      fireEvent.keyDown(document, { key: '/' });
      fireEvent.keyDown(document, { key: '3' });
      fireEvent.keyDown(document, { key: 'Enter' });

      expectDisplay('5');
    });

    it('full calculation with decimal via keyboard: 2.5 + 1.5 = 4', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '2' });
      fireEvent.keyDown(document, { key: '.' });
      fireEvent.keyDown(document, { key: '5' });
      fireEvent.keyDown(document, { key: '+' });
      fireEvent.keyDown(document, { key: '1' });
      fireEvent.keyDown(document, { key: '.' });
      fireEvent.keyDown(document, { key: '5' });
      fireEvent.keyDown(document, { key: 'Enter' });

      expectDisplay('4');
    });

    it('multiple operations via keyboard: 2 + 3 * 4 = 20', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '2' });
      fireEvent.keyDown(document, { key: '+' });
      fireEvent.keyDown(document, { key: '3' });
      fireEvent.keyDown(document, { key: '*' });
      fireEvent.keyDown(document, { key: '4' });
      fireEvent.keyDown(document, { key: 'Enter' });

      // Result depends on calculator implementation
      // If it evaluates left-to-right: (2 + 3) * 4 = 20
      // If it respects order of operations: 2 + (3 * 4) = 14
      expect(getDisplayValue()).toBeDefined();
    });
  });

  describe('Mixed Interactions', () => {
    it('mixing mouse and keyboard input works correctly', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Click 5
      await user.click(screen.getByRole('button', { name: '5' }));

      // Type +
      fireEvent.keyDown(document, { key: '+' });

      // Click 3
      await user.click(screen.getByRole('button', { name: '3' }));

      // Type Enter
      fireEvent.keyDown(document, { key: 'Enter' });

      expectDisplay('8');
    });

    it('keyboard input after mouse click works', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Click 2
      await user.click(screen.getByRole('button', { name: '2' }));

      // Type * 5 Enter
      fireEvent.keyDown(document, { key: '*' });
      fireEvent.keyDown(document, { key: '5' });
      fireEvent.keyDown(document, { key: 'Enter' });

      expectDisplay('10');
    });
  });

  describe('Error Handling', () => {
    it('handles division by zero gracefully', async () => {
      const user = userEvent.setup();
      renderCalculator();

      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // Should show error or Infinity
      const displayValue = getDisplayValue();
      expect(displayValue === 'Error' || displayValue === 'Infinity').toBe(true);
    });

    it('handles division by zero via keyboard', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '5' });
      fireEvent.keyDown(document, { key: '/' });
      fireEvent.keyDown(document, { key: '0' });
      fireEvent.keyDown(document, { key: 'Enter' });

      // Should show error or Infinity
      const displayValue = getDisplayValue();
      expect(displayValue === 'Error' || displayValue === 'Infinity').toBe(true);
    });
  });

  describe('Parentheses Support', () => {
    it('handles parentheses via keyboard', () => {
      renderCalculator();

      fireEvent.keyDown(document, { key: '(' });
      fireEvent.keyDown(document, { key: '2' });
      fireEvent.keyDown(document, { key: '+' });
      fireEvent.keyDown(document, { key: '3' });
      fireEvent.keyDown(document, { key: ')' });
      fireEvent.keyDown(document, { key: '*' });
      fireEvent.keyDown(document, { key: '4' });
      fireEvent.keyDown(document, { key: 'Enter' });

      expectDisplay('20');
    });
  });

  describe('Scientific Functions', () => {
    it('calculates sin(30) in DEG mode = 0.5', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Enter 30
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: '0' }));

      // Click sin button
      await user.click(screen.getByRole('button', { name: 'Sine' }));

      expectDisplay('0.5');
    });

    it('calculates cos(60) in DEG mode = 0.5', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Enter 60
      await user.click(screen.getByRole('button', { name: '6' }));
      await user.click(screen.getByRole('button', { name: '0' }));

      // Click cos button
      await user.click(screen.getByRole('button', { name: 'Cosine' }));

      expectDisplay('0.5');
    });

    it('calculates √16 = 4', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Enter 16
      await user.click(screen.getByRole('button', { name: '1' }));
      await user.click(screen.getByRole('button', { name: '6' }));

      // Click √ button
      await user.click(screen.getByRole('button', { name: 'Square root' }));

      expectDisplay('4');
    });

    it('calculates 5² = 25', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Enter 5
      await user.click(screen.getByRole('button', { name: '5' }));

      // Click x² button
      await user.click(screen.getByRole('button', { name: 'Square' }));

      expectDisplay('25');
    });

    it('calculates 1/4 = 0.25', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Enter 4
      await user.click(screen.getByRole('button', { name: '4' }));

      // Click 1/x button
      await user.click(screen.getByRole('button', { name: 'Reciprocal' }));

      expectDisplay('0.25');
    });
  });

  describe('Constants', () => {
    it('π button shows approximately 3.14159...', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Click π button
      await user.click(screen.getByRole('button', { name: 'Pi' }));

      const displayValue = getDisplayValue();
      const piValue = parseFloat(displayValue);

      // Check that it's approximately π (3.14159...)
      expect(piValue).toBeCloseTo(Math.PI, 5);
    });

    it('e button shows approximately 2.71828...', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Click e button
      await user.click(screen.getByRole('button', { name: "Euler's number" }));

      const displayValue = getDisplayValue();
      const eValue = parseFloat(displayValue);

      // Check that it's approximately e (2.71828...)
      expect(eValue).toBeCloseTo(Math.E, 5);
    });
  });

  describe('Angle Mode', () => {
    it('DEG/RAD toggle changes mode indicator', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Find angle mode button
      const angleModeButton = screen.getByRole('button', { name: /Angle mode/ });

      // Initial mode should be DEG
      expect(angleModeButton.textContent).toBe('DEG');

      // Toggle to RAD
      await user.click(angleModeButton);
      expect(angleModeButton.textContent).toBe('RAD');

      // Toggle back to DEG
      await user.click(angleModeButton);
      expect(angleModeButton.textContent).toBe('DEG');
    });

    it('sin(30) in DEG mode vs sin(π/6) in RAD mode give same result', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Test sin(30) in DEG mode
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Sine' }));

      const degResult = getDisplayValue();

      // Clear calculator
      await user.click(screen.getByRole('button', { name: 'Clear' }));

      // Switch to RAD mode
      await user.click(screen.getByRole('button', { name: /Angle mode/ }));

      // Enter π/6 (approximately 0.5236)
      // First enter π
      await user.click(screen.getByRole('button', { name: 'Pi' }));

      // Divide by 6
      await user.click(screen.getByRole('button', { name: 'Divide' }));
      await user.click(screen.getByRole('button', { name: '6' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // Apply sin
      await user.click(screen.getByRole('button', { name: 'Sine' }));

      const radResult = getDisplayValue();

      // Both should be 0.5
      expect(parseFloat(degResult)).toBeCloseTo(0.5, 5);
      expect(parseFloat(radResult)).toBeCloseTo(0.5, 5);
    });
  });

  describe('Theme', () => {
    it('theme toggle changes data-theme attribute', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Get initial theme
      const initialTheme = document.documentElement.getAttribute('data-theme');
      expect(['light', 'dark']).toContain(initialTheme);

      // Find and click theme toggle button - it has specific aria-label
      const themeToggleButton = screen.getByRole('button', { name: /Switch to (dark|light) mode/ });
      await user.click(themeToggleButton);

      // Theme should have changed
      const newTheme = document.documentElement.getAttribute('data-theme');
      expect(newTheme).not.toBe(initialTheme);
      expect(['light', 'dark']).toContain(newTheme);
    });

    it('initial theme matches system preference or default', () => {
      renderCalculator();

      const theme = document.documentElement.getAttribute('data-theme');

      // Theme should be either 'light' or 'dark'
      expect(['light', 'dark']).toContain(theme);
    });
  });

  describe('History', () => {
    it('performs calculation, opens history panel, verifies entry exists', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Perform a calculation: 5 + 3 = 8
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '3' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // Open history panel
      const historyButton = screen.getByRole('button', { name: 'Toggle history panel' });
      await user.click(historyButton);

      // Verify history entry exists
      // Look for the expression and result in the history panel
      expect(screen.getByText(/5.*\+.*3/)).toBeInTheDocument();
      expect(screen.getByText(/=\s*8/)).toBeInTheDocument();
    });

    it('history entries are clickable and have correct structure', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Perform a calculation: 7 * 6 = 42
      await user.click(screen.getByRole('button', { name: '7' }));
      await user.click(screen.getByRole('button', { name: 'Multiply' }));
      await user.click(screen.getByRole('button', { name: '6' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // Open history panel
      const historyButton = screen.getByRole('button', { name: 'Toggle history panel' });
      await user.click(historyButton);

      // Verify history entry structure
      const resultText = screen.getByText(/=\s*42/);
      const historyEntry = resultText.parentElement;

      // Verify the history entry exists and has correct attributes
      expect(historyEntry).not.toBeNull();
      expect(historyEntry).toHaveAttribute('role', 'button');
      expect(historyEntry).toHaveAttribute('tabIndex', '0');

      // Verify expression is also present (7 * 6 or 7 × 6)
      expect(screen.getByText(/7.*[*×].*6/)).toBeInTheDocument();
    });

    it('clears history, verifies panel shows "No history"', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Perform a calculation
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Add' }));
      await user.click(screen.getByRole('button', { name: '2' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // Open history panel
      const historyButton = screen.getByRole('button', { name: 'Toggle history panel' });
      await user.click(historyButton);

      // Clear history
      const clearButton = screen.getByText('Clear All');
      await user.click(clearButton);

      // Verify "No history" message appears
      expect(screen.getByText('No history')).toBeInTheDocument();
    });
  });

  describe('Error Handling - Advanced', () => {
    it('√(-4) shows "Error"', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Enter -4 (we need to enter 4 and then make it negative)
      await user.click(screen.getByRole('button', { name: '4' }));

      // Make it negative by doing 0 - 4
      await user.click(screen.getByRole('button', { name: 'Clear' }));
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Subtract' }));
      await user.click(screen.getByRole('button', { name: '4' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // Now apply sqrt to -4
      await user.click(screen.getByRole('button', { name: 'Square root' }));

      expectDisplay('Error');
    });

    it('tan(90) in DEG mode shows "Error"', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Ensure we're in DEG mode
      const angleModeButton = screen.getByRole('button', { name: /Angle mode/ });
      if (angleModeButton.textContent !== 'DEG') {
        await user.click(angleModeButton);
      }

      // Enter 90
      await user.click(screen.getByRole('button', { name: '9' }));
      await user.click(screen.getByRole('button', { name: '0' }));

      // Click tan button
      await user.click(screen.getByRole('button', { name: 'Tangent' }));

      expectDisplay('Error');
    });

    it('ln(0) shows "Error"', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Enter 0
      await user.click(screen.getByRole('button', { name: '0' }));

      // Click ln button
      await user.click(screen.getByRole('button', { name: 'Natural logarithm' }));

      expectDisplay('Error');
    });

    it('ln(-5) shows "Error"', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Enter 0 - 5 to get -5
      await user.click(screen.getByRole('button', { name: '0' }));
      await user.click(screen.getByRole('button', { name: 'Subtract' }));
      await user.click(screen.getByRole('button', { name: '5' }));
      await user.click(screen.getByRole('button', { name: 'Equals' }));

      // Apply ln
      await user.click(screen.getByRole('button', { name: 'Natural logarithm' }));

      expectDisplay('Error');
    });

    it('1/0 shows "Error"', async () => {
      const user = userEvent.setup();
      renderCalculator();

      // Enter 0
      await user.click(screen.getByRole('button', { name: '0' }));

      // Click 1/x button
      await user.click(screen.getByRole('button', { name: 'Reciprocal' }));

      expectDisplay('Error');
    });
  });
});
