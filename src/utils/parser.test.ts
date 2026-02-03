import { describe, it, expect } from 'vitest';
import { parseExpression } from './parser';
import { ERROR_MESSAGES } from './constants';

describe('parseExpression', () => {
  describe('basic expressions', () => {
    it('should evaluate simple addition', () => {
      expect(parseExpression('2+3')).toBe(5);
    });

    it('should evaluate simple subtraction', () => {
      expect(parseExpression('5-3')).toBe(2);
    });

    it('should evaluate simple multiplication', () => {
      expect(parseExpression('3*4')).toBe(12);
    });

    it('should evaluate simple division', () => {
      expect(parseExpression('8/2')).toBe(4);
    });

    it('should handle decimal numbers', () => {
      expect(parseExpression('2.5+3.5')).toBe(6);
    });

    it('should handle whitespace', () => {
      expect(parseExpression('2 + 3')).toBe(5);
      expect(parseExpression('  2  +  3  ')).toBe(5);
    });
  });

  describe('operator precedence', () => {
    it('should multiply before adding', () => {
      expect(parseExpression('2+3*4')).toBe(14);
    });

    it('should divide before adding', () => {
      expect(parseExpression('10+8/2')).toBe(14);
    });

    it('should multiply before subtracting', () => {
      expect(parseExpression('10-2*3')).toBe(4);
    });

    it('should handle multiple operations with correct precedence', () => {
      expect(parseExpression('2+3*4-5')).toBe(9);
    });

    it('should handle consecutive multiplications and divisions', () => {
      expect(parseExpression('2*3*4')).toBe(24);
      expect(parseExpression('24/2/3')).toBe(4);
    });
  });

  describe('parentheses', () => {
    it('should evaluate simple parentheses', () => {
      expect(parseExpression('(2+3)*4')).toBe(20);
    });

    it('should override operator precedence with parentheses', () => {
      expect(parseExpression('(10-2)*3')).toBe(24);
    });

    it('should handle multiple parenthesized groups', () => {
      expect(parseExpression('(2+3)*(4+5)')).toBe(45);
    });

    it('should handle parentheses with division', () => {
      expect(parseExpression('(10+2)/3')).toBe(4);
    });
  });

  describe('nested parentheses', () => {
    it('should evaluate nested parentheses', () => {
      expect(parseExpression('((2+3)*2)+5')).toBe(15);
    });

    it('should handle deeply nested parentheses', () => {
      expect(parseExpression('(((2+1)*2)+4)*2')).toBe(20);
    });

    it('should handle multiple levels of nesting', () => {
      expect(parseExpression('((2+3)*(4+5))+10')).toBe(55);
    });

    it('should handle nested parentheses with all operators', () => {
      expect(parseExpression('((10-2)*3)+6/2')).toBe(27);
    });
  });

  describe('error handling', () => {
    it('should throw error for mismatched opening parenthesis', () => {
      expect(() => parseExpression('(2+3')).toThrow(
        ERROR_MESSAGES.PARENTHESIS_MISMATCH
      );
    });

    it('should throw error for mismatched closing parenthesis', () => {
      expect(() => parseExpression('2+3)')).toThrow(
        ERROR_MESSAGES.PARENTHESIS_MISMATCH
      );
    });

    it('should throw error for multiple mismatched parentheses', () => {
      expect(() => parseExpression('((2+3)')).toThrow(
        ERROR_MESSAGES.PARENTHESIS_MISMATCH
      );
      expect(() => parseExpression('(2+3))')).toThrow(
        ERROR_MESSAGES.PARENTHESIS_MISMATCH
      );
    });

    it('should throw error for division by zero', () => {
      expect(() => parseExpression('5/0')).toThrow(
        ERROR_MESSAGES.DIVISION_BY_ZERO
      );
    });

    it('should throw error for empty expression', () => {
      expect(() => parseExpression('')).toThrow(ERROR_MESSAGES.INVALID_INPUT);
      expect(() => parseExpression('   ')).toThrow(
        ERROR_MESSAGES.INVALID_INPUT
      );
    });

    it('should throw error for invalid input', () => {
      expect(() => parseExpression('2+')).toThrow(
        ERROR_MESSAGES.INVALID_INPUT
      );
    });
  });

  describe('complex expressions', () => {
    it('should handle complex expression with all features', () => {
      expect(parseExpression('((2+3)*4-10)/2')).toBe(5);
    });

    it('should handle expression with many operations', () => {
      expect(parseExpression('1+2*3-4/2+(5-3)*2')).toBe(9);
    });

    it('should handle decimal results', () => {
      expect(parseExpression('5/2')).toBe(2.5);
      expect(parseExpression('(3+2)/2')).toBe(2.5);
    });
  });
});
