import { ERROR_MESSAGES } from './constants';

/**
 * Tokenize an expression string into numbers and operators
 */
function tokenize(expression: string): string[] {
  const tokens: string[] = [];
  let currentNumber = '';

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === ' ') {
      continue; // Skip whitespace
    }

    if (char >= '0' && char <= '9' || char === '.') {
      currentNumber += char;
    } else {
      if (currentNumber) {
        tokens.push(currentNumber);
        currentNumber = '';
      }
      tokens.push(char);
    }
  }

  if (currentNumber) {
    tokens.push(currentNumber);
  }

  return tokens;
}

/**
 * Check if parentheses are balanced in the expression
 */
function validateParentheses(tokens: string[]): void {
  let depth = 0;

  for (const token of tokens) {
    if (token === '(') {
      depth++;
    } else if (token === ')') {
      depth--;
      if (depth < 0) {
        throw new Error(ERROR_MESSAGES.PARENTHESIS_MISMATCH);
      }
    }
  }

  if (depth !== 0) {
    throw new Error(ERROR_MESSAGES.PARENTHESIS_MISMATCH);
  }
}

/**
 * Parse and evaluate an expression with proper operator precedence
 * Handles parentheses recursively
 */
function evaluateTokens(tokens: string[]): number {
  validateParentheses(tokens);

  // Handle parentheses first by recursively evaluating inner expressions
  while (tokens.includes('(')) {
    let openIndex = -1;
    let closeIndex = -1;

    // Find the innermost parentheses pair
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i] === '(') {
        openIndex = i;
      } else if (tokens[i] === ')') {
        closeIndex = i;
        break;
      }
    }

    // Extract and evaluate the expression inside parentheses
    const innerTokens = tokens.slice(openIndex + 1, closeIndex);
    const result = evaluateTokens(innerTokens);

    // Replace the parenthesized expression with its result
    tokens.splice(openIndex, closeIndex - openIndex + 1, result.toString());
  }

  // Handle exponentiation (highest precedence after parentheses)
  // Process right-to-left for right associativity (2^3^2 = 2^9 = 512, not 8^2 = 64)
  let i = tokens.length - 1;
  while (i >= 0) {
    if (tokens[i] === '^') {
      if (i === 0 || i === tokens.length - 1 || !tokens[i - 1] || !tokens[i + 1]) {
        throw new Error(ERROR_MESSAGES.INVALID_INPUT);
      }

      const left = parseFloat(tokens[i - 1]);
      const right = parseFloat(tokens[i + 1]);

      if (isNaN(left) || isNaN(right)) {
        throw new Error(ERROR_MESSAGES.INVALID_INPUT);
      }

      const result = Math.pow(left, right);
      tokens.splice(i - 1, 3, result.toString());
      i = tokens.length - 1; // Reset to end
    } else {
      i--;
    }
  }

  // Handle multiplication and division (higher precedence)
  i = 0;
  while (i < tokens.length) {
    if (tokens[i] === '*' || tokens[i] === '/') {
      if (i === 0 || i === tokens.length - 1 || !tokens[i - 1] || !tokens[i + 1]) {
        throw new Error(ERROR_MESSAGES.INVALID_INPUT);
      }

      const left = parseFloat(tokens[i - 1]);
      const right = parseFloat(tokens[i + 1]);
      const operator = tokens[i];

      if (isNaN(left) || isNaN(right)) {
        throw new Error(ERROR_MESSAGES.INVALID_INPUT);
      }

      let result: number;
      if (operator === '*') {
        result = left * right;
      } else {
        if (right === 0) {
          throw new Error(ERROR_MESSAGES.DIVISION_BY_ZERO);
        }
        result = left / right;
      }

      tokens.splice(i - 1, 3, result.toString());
      i = 0; // Reset to start
    } else {
      i++;
    }
  }

  // Handle addition and subtraction (lower precedence)
  i = 0;
  while (i < tokens.length) {
    if (tokens[i] === '+' || tokens[i] === '-') {
      if (i === 0 || i === tokens.length - 1 || !tokens[i - 1] || !tokens[i + 1]) {
        throw new Error(ERROR_MESSAGES.INVALID_INPUT);
      }

      const left = parseFloat(tokens[i - 1]);
      const right = parseFloat(tokens[i + 1]);
      const operator = tokens[i];

      if (isNaN(left) || isNaN(right)) {
        throw new Error(ERROR_MESSAGES.INVALID_INPUT);
      }

      const result = operator === '+' ? left + right : left - right;

      tokens.splice(i - 1, 3, result.toString());
      i = 0; // Reset to start
    } else {
      i++;
    }
  }

  // Should have a single number left
  if (tokens.length !== 1) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  return parseFloat(tokens[0]);
}

/**
 * Parse and evaluate a mathematical expression
 * Supports: +, -, *, /, ^ operators with proper precedence
 * Supports: parentheses for grouping
 *
 * @param expression - The mathematical expression to evaluate
 * @returns The result of the evaluation
 * @throws Error if expression is invalid or has mismatched parentheses
 *
 * @example
 * parseExpression("2+3") // returns 5
 * parseExpression("2+3*4") // returns 14
 * parseExpression("(2+3)*4") // returns 20
 * parseExpression("((2+3)*2)+5") // returns 15
 * parseExpression("2^10") // returns 1024
 */
export function parseExpression(expression: string): number {
  if (!expression || expression.trim() === '') {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  const tokens = tokenize(expression);

  if (tokens.length === 0) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  return evaluateTokens(tokens);
}
