import { describe, it, expect } from 'vitest';
import {
  sin,
  cos,
  tan,
  ln,
  log10,
  sqrt,
  square,
  reciprocal,
  power,
  applyScientificOperation,
} from './scientific';

describe('Trigonometric Functions', () => {
  describe('sin', () => {
    it('should calculate sin(30°) = 0.5 in DEG mode', () => {
      expect(sin(30, 'DEG')).toBe(0.5);
    });

    it('should calculate sin(0°) = 0', () => {
      expect(sin(0, 'DEG')).toBe(0);
    });

    it('should calculate sin(90°) = 1', () => {
      expect(sin(90, 'DEG')).toBe(1);
    });

    it('should calculate sin(π/6) = 0.5 in RAD mode', () => {
      expect(sin(Math.PI / 6, 'RAD')).toBe(0.5);
    });
  });

  describe('cos', () => {
    it('should calculate cos(60°) = 0.5 in DEG mode', () => {
      expect(cos(60, 'DEG')).toBe(0.5);
    });

    it('should calculate cos(0°) = 1', () => {
      expect(cos(0, 'DEG')).toBe(1);
    });

    it('should calculate cos(90°) = 0', () => {
      expect(cos(90, 'DEG')).toBe(0);
    });
  });

  describe('tan', () => {
    it('should calculate tan(45°) = 1 in DEG mode', () => {
      expect(tan(45, 'DEG')).toBe(1);
    });

    it('should calculate tan(0°) = 0', () => {
      expect(tan(0, 'DEG')).toBe(0);
    });

    it('should return error for tan(90°)', () => {
      expect(tan(90, 'DEG')).toBe('Error');
    });

    it('should return error for tan(270°)', () => {
      expect(tan(270, 'DEG')).toBe('Error');
    });
  });
});

describe('Logarithmic Functions', () => {
  describe('ln (natural log)', () => {
    it('should calculate ln(e) = 1', () => {
      expect(ln(Math.E)).toBeCloseTo(1, 10);
    });

    it('should calculate ln(1) = 0', () => {
      expect(ln(1)).toBe(0);
    });

    it('should return error for ln(-5)', () => {
      expect(ln(-5)).toBe('Error');
    });

    it('should return error for ln(0)', () => {
      expect(ln(0)).toBe('Error');
    });
  });

  describe('log10', () => {
    it('should calculate log(100) = 2', () => {
      expect(log10(100)).toBe(2);
    });

    it('should calculate log(10) = 1', () => {
      expect(log10(10)).toBe(1);
    });

    it('should calculate log(1) = 0', () => {
      expect(log10(1)).toBe(0);
    });

    it('should return error for log(-5)', () => {
      expect(log10(-5)).toBe('Error');
    });

    it('should return error for log(0)', () => {
      expect(log10(0)).toBe('Error');
    });
  });
});

describe('Power and Root Functions', () => {
  describe('sqrt', () => {
    it('should calculate √16 = 4', () => {
      expect(sqrt(16)).toBe(4);
    });

    it('should calculate √0 = 0', () => {
      expect(sqrt(0)).toBe(0);
    });

    it('should calculate √2', () => {
      expect(sqrt(2)).toBeCloseTo(1.41421356, 5);
    });

    it('should return error for √(-4)', () => {
      expect(sqrt(-4)).toBe('Error');
    });
  });

  describe('square', () => {
    it('should calculate 5² = 25', () => {
      expect(square(5)).toBe(25);
    });

    it('should calculate (-3)² = 9', () => {
      expect(square(-3)).toBe(9);
    });

    it('should calculate 0² = 0', () => {
      expect(square(0)).toBe(0);
    });
  });

  describe('power', () => {
    it('should calculate 2^10 = 1024', () => {
      expect(power(2, 10)).toBe(1024);
    });

    it('should calculate 3^0 = 1', () => {
      expect(power(3, 0)).toBe(1);
    });

    it('should calculate 2^(-1) = 0.5', () => {
      expect(power(2, -1)).toBe(0.5);
    });
  });
});

describe('Reciprocal Function', () => {
  describe('reciprocal (1/x)', () => {
    it('should calculate 1/4 = 0.25', () => {
      expect(reciprocal(4)).toBe(0.25);
    });

    it('should calculate 1/1 = 1', () => {
      expect(reciprocal(1)).toBe(1);
    });

    it('should calculate 1/(-2) = -0.5', () => {
      expect(reciprocal(-2)).toBe(-0.5);
    });

    it('should return error for 1/0', () => {
      expect(reciprocal(0)).toBe('Error');
    });
  });
});

describe('applyScientificOperation', () => {
  it('should apply sin operation', () => {
    expect(applyScientificOperation('sin', 30, 'DEG')).toBe(0.5);
  });

  it('should apply cos operation', () => {
    expect(applyScientificOperation('cos', 60, 'DEG')).toBe(0.5);
  });

  it('should apply sqrt operation', () => {
    expect(applyScientificOperation('sqrt', 16, 'DEG')).toBe(4);
  });

  it('should apply square operation', () => {
    expect(applyScientificOperation('square', 5, 'DEG')).toBe(25);
  });

  it('should apply reciprocal operation', () => {
    expect(applyScientificOperation('reciprocal', 4, 'DEG')).toBe(0.25);
  });

  it('should return error for invalid operation', () => {
    expect(applyScientificOperation('invalid', 5, 'DEG')).toBe('Error');
  });
});
