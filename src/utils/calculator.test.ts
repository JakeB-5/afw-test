import { describe, it, expect } from 'vitest';
import { add, subtract, multiply, divide, calculate, formatNumber, isError } from './calculator';

describe('Basic Arithmetic Operations', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(5, 3)).toBe(8);
    });

    it('should add negative numbers', () => {
      expect(add(-5, -3)).toBe(-8);
    });

    it('should add zero', () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers', () => {
      expect(subtract(10, 4)).toBe(6);
    });

    it('should handle negative result', () => {
      expect(subtract(4, 10)).toBe(-6);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(7, 6)).toBe(42);
    });

    it('should handle zero', () => {
      expect(multiply(7, 0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(multiply(-3, 4)).toBe(-12);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(20, 4)).toBe(5);
    });

    it('should return error for division by zero', () => {
      const result = divide(10, 0);
      expect(result).toBe('Error');
    });

    it('should handle decimal results', () => {
      expect(divide(10, 4)).toBe(2.5);
    });
  });
});

describe('calculate', () => {
  it('should perform addition', () => {
    expect(calculate(5, 3, '+')).toBe(8);
  });

  it('should perform subtraction', () => {
    expect(calculate(10, 4, '-')).toBe(6);
  });

  it('should perform multiplication', () => {
    expect(calculate(7, 6, '*')).toBe(42);
  });

  it('should perform division', () => {
    expect(calculate(20, 4, '/')).toBe(5);
  });

  it('should return error for division by zero', () => {
    const result = calculate(10, 0, '/');
    expect(isError(result)).toBe(true);
  });
});

describe('formatNumber', () => {
  it('should format integers correctly', () => {
    expect(formatNumber(42)).toBe('42');
  });

  it('should format decimals correctly', () => {
    expect(formatNumber(3.14159)).toBe('3.14159');
  });

  it('should handle very small numbers', () => {
    const result = formatNumber(1e-15);
    expect(result).toContain('e');
  });

  it('should handle infinity as error', () => {
    expect(formatNumber(Infinity)).toBe('Error');
  });
});

describe('isError', () => {
  it('should return true for string errors', () => {
    expect(isError('Error')).toBe(true);
  });

  it('should return false for numbers', () => {
    expect(isError(42)).toBe(false);
  });
});
