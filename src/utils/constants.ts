// Mathematical constants
export const PI = Math.PI;
export const E = Math.E;

// Display precision
export const DISPLAY_PRECISION = 10;
export const MAX_DISPLAY_LENGTH = 15;

// History limits
export const MAX_HISTORY_ITEMS = 50;

// Angle conversion factors
export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;

// Error messages
export const ERROR_MESSAGES = {
  DIVISION_BY_ZERO: 'Error',
  INVALID_INPUT: 'Error',
  NEGATIVE_SQRT: 'Error',
  UNDEFINED_TAN: 'Error',
  NEGATIVE_LOG: 'Error',
  ZERO_LOG: 'Error',
  ZERO_RECIPROCAL: 'Error',
  PARENTHESIS_MISMATCH: 'Error',
  OVERFLOW: 'Error',
} as const;

// Button labels
export const BUTTON_LABELS = {
  // Numbers
  ZERO: '0',
  ONE: '1',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
  SEVEN: '7',
  EIGHT: '8',
  NINE: '9',
  DECIMAL: '.',

  // Basic operators
  ADD: '+',
  SUBTRACT: '-',
  MULTIPLY: '×',
  DIVIDE: '÷',
  EQUALS: '=',

  // Control
  CLEAR: 'C',
  CLEAR_ENTRY: 'CE',
  BACKSPACE: '⌫',

  // Scientific
  SIN: 'sin',
  COS: 'cos',
  TAN: 'tan',
  LN: 'ln',
  LOG: 'log',
  SQRT: '√',
  POWER: 'xʸ',
  SQUARE: 'x²',
  RECIPROCAL: '1/x',

  // Constants
  PI: 'π',
  E: 'e',

  // Parentheses
  OPEN_PAREN: '(',
  CLOSE_PAREN: ')',

  // Angle mode
  DEG: 'DEG',
  RAD: 'RAD',
} as const;
