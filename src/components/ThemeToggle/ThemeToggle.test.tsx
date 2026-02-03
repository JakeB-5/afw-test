import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../../context/ThemeContext';

describe('ThemeToggle', () => {
  it('renders theme toggle button', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('displays sun icon in light mode', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    // Check aria-label for light mode
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    // Check that SVG with circle (sun center) is present
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(button.querySelector('circle')).toBeInTheDocument();
  });

  it('toggles theme on click', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Initially light mode
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

    // Click to toggle to dark mode
    await user.click(button);

    // Should now show moon icon (dark mode)
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

    // Click again to toggle back to light mode
    await user.click(button);

    // Should show sun icon again
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('displays moon icon in dark mode', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Toggle to dark mode
    await user.click(button);

    // Check aria-label for dark mode
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');

    // Check that SVG with path (moon shape) is present
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(button.querySelector('path')).toBeInTheDocument();
    // Moon icon should not have circle element
    expect(button.querySelector('circle')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');

    // Should have aria-label
    expect(button).toHaveAttribute('aria-label');

    // Should have title for tooltip
    expect(button).toHaveAttribute('title');

    // Should be a button type
    expect(button).toHaveAttribute('type', 'button');
  });
});
