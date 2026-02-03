import type { BasicOperator } from '../types/calculator';
import { ERROR_MESSAGES, DISPLAY_PRECISION } from './constants';
import { power } from './scientific';

/**
 * Format a number for display, handling precision and special cases
 */
export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) {
    return ERROR_MESSAGES.OVERFLOW;
  }

  // Handle very small numbers close to zero
  if (Math.abs(value) < 1e-10 && value !== 0) {
    return value.toExponential(DISPLAY_PRECISION - 1);
  }

  // Convert to string and handle precision
  const str = value.toPrecision(DISPLAY_PRECISION);
  const parsed = parseFloat(str);

  // Remove trailing zeros after decimal point
  if (Number.isInteger(parsed)) {
    return parsed.toString();
  }

  return parsed.toString();
}

/**
 * Add two numbers
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Subtract b from a
 */
export function subtract(a: number, b: number): number {
  return a - b;
}

/**
 * Multiply two numbers
 */
export function multiply(a: number, b: number): number {
  return a * b;
}

/**
 * Divide a by b
 * @throws Error if b is zero
 */
export function divide(a: number, b: number): number | string {
  if (b === 0) {
    return ERROR_MESSAGES.DIVISION_BY_ZERO;
  }
  return a / b;
}

/**
 * Perform a calculation with the given operator
 */
export function calculate(
  a: number,
  b: number,
  operator: BasicOperator
): number | string {
  switch (operator) {
    case '+':
      return add(a, b);
    case '-':
      return subtract(a, b);
    case '*':
      return multiply(a, b);
    case '/':
      return divide(a, b);
    case '^':
      return power(a, b);
    default:
      return ERROR_MESSAGES.INVALID_INPUT;
  }
}

/**
 * Check if a string represents a valid number
 */
export function isValidNumber(value: string): boolean {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
}

/**
 * Parse a string to a number
 */
export function parseNumber(value: string): number {
  return parseFloat(value);
}

/**
 * Check if result is an error string
 */
export function isError(result: number | string): result is string {
  return typeof result === 'string';
}
