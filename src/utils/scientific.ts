import type { AngleMode } from '../types/calculator';
import { ERROR_MESSAGES, DEG_TO_RAD } from './constants';

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * DEG_TO_RAD;
}

/**
 * Convert angle to radians based on current mode
 */
function toRadians(value: number, mode: AngleMode): number {
  return mode === 'DEG' ? degreesToRadians(value) : value;
}

/**
 * Calculate sine
 */
export function sin(value: number, mode: AngleMode): number {
  const radians = toRadians(value, mode);
  const result = Math.sin(radians);
  // Handle floating point errors for common angles
  if (Math.abs(result) < 1e-10) return 0;
  if (Math.abs(result - 1) < 1e-10) return 1;
  if (Math.abs(result + 1) < 1e-10) return -1;
  if (Math.abs(result - 0.5) < 1e-10) return 0.5;
  if (Math.abs(result + 0.5) < 1e-10) return -0.5;
  return result;
}

/**
 * Calculate cosine
 */
export function cos(value: number, mode: AngleMode): number {
  const radians = toRadians(value, mode);
  const result = Math.cos(radians);
  // Handle floating point errors for common angles
  if (Math.abs(result) < 1e-10) return 0;
  if (Math.abs(result - 1) < 1e-10) return 1;
  if (Math.abs(result + 1) < 1e-10) return -1;
  if (Math.abs(result - 0.5) < 1e-10) return 0.5;
  if (Math.abs(result + 0.5) < 1e-10) return -0.5;
  return result;
}

/**
 * Calculate tangent
 * Returns error for angles where tan is undefined (90°, 270°, etc.)
 */
export function tan(value: number, mode: AngleMode): number | string {
  const radians = toRadians(value, mode);

  // Check for undefined values (90°, 270°, etc. in DEG mode)
  if (mode === 'DEG') {
    const normalized = ((value % 360) + 360) % 360;
    if (Math.abs(normalized - 90) < 1e-10 || Math.abs(normalized - 270) < 1e-10) {
      return ERROR_MESSAGES.UNDEFINED_TAN;
    }
  } else {
    // RAD mode: check for π/2, 3π/2, etc.
    const normalized = ((radians % Math.PI) + Math.PI) % Math.PI;
    if (Math.abs(normalized - Math.PI / 2) < 1e-10) {
      return ERROR_MESSAGES.UNDEFINED_TAN;
    }
  }

  const result = Math.tan(radians);
  // Handle floating point errors
  if (Math.abs(result) < 1e-10) return 0;
  if (Math.abs(result - 1) < 1e-10) return 1;
  if (Math.abs(result + 1) < 1e-10) return -1;
  return result;
}

/**
 * Calculate natural logarithm (ln)
 * Returns error for non-positive values
 */
export function ln(value: number): number | string {
  if (value <= 0) {
    return value === 0 ? ERROR_MESSAGES.ZERO_LOG : ERROR_MESSAGES.NEGATIVE_LOG;
  }
  return Math.log(value);
}

/**
 * Calculate base-10 logarithm (log)
 * Returns error for non-positive values
 */
export function log10(value: number): number | string {
  if (value <= 0) {
    return value === 0 ? ERROR_MESSAGES.ZERO_LOG : ERROR_MESSAGES.NEGATIVE_LOG;
  }
  return Math.log10(value);
}

/**
 * Calculate square root
 * Returns error for negative values
 */
export function sqrt(value: number): number | string {
  if (value < 0) {
    return ERROR_MESSAGES.NEGATIVE_SQRT;
  }
  return Math.sqrt(value);
}

/**
 * Calculate square (x²)
 */
export function square(value: number): number {
  return value * value;
}

/**
 * Calculate reciprocal (1/x)
 * Returns error for zero
 */
export function reciprocal(value: number): number | string {
  if (value === 0) {
    return ERROR_MESSAGES.ZERO_RECIPROCAL;
  }
  return 1 / value;
}

/**
 * Calculate power (x^y)
 */
export function power(base: number, exponent: number): number | string {
  const result = Math.pow(base, exponent);
  if (!Number.isFinite(result)) {
    return ERROR_MESSAGES.OVERFLOW;
  }
  return result;
}

/**
 * Apply a scientific operation
 */
export function applyScientificOperation(
  operation: string,
  value: number,
  mode: AngleMode
): number | string {
  switch (operation) {
    case 'sin':
      return sin(value, mode);
    case 'cos':
      return cos(value, mode);
    case 'tan':
      return tan(value, mode);
    case 'ln':
      return ln(value);
    case 'log':
      return log10(value);
    case 'sqrt':
      return sqrt(value);
    case 'square':
      return square(value);
    case 'reciprocal':
      return reciprocal(value);
    default:
      return ERROR_MESSAGES.INVALID_INPUT;
  }
}
