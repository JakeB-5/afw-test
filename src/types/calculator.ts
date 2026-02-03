// Operator types
export type BasicOperator = '+' | '-' | '*' | '/';
export type ScientificOperator = 'sin' | 'cos' | 'tan' | 'ln' | 'log' | 'sqrt' | 'square' | 'reciprocal' | 'pow';
export type Operator = BasicOperator | ScientificOperator;

// Angle mode for trigonometric functions
export type AngleMode = 'DEG' | 'RAD';

// Theme
export type Theme = 'light' | 'dark';

// History entry
export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

// Calculator action types
export type CalculatorActionType =
  | 'DIGIT'
  | 'DECIMAL'
  | 'OPERATOR'
  | 'EQUALS'
  | 'CLEAR'
  | 'CLEAR_ENTRY'
  | 'BACKSPACE'
  | 'SCIENTIFIC'
  | 'TOGGLE_ANGLE'
  | 'CONSTANT'
  | 'PARENTHESIS'
  | 'ADD_HISTORY'
  | 'CLEAR_HISTORY'
  | 'LOAD_FROM_HISTORY';

// Calculator actions
export interface DigitAction {
  type: 'DIGIT';
  payload: string;
}

export interface DecimalAction {
  type: 'DECIMAL';
}

export interface OperatorAction {
  type: 'OPERATOR';
  payload: BasicOperator;
}

export interface EqualsAction {
  type: 'EQUALS';
}

export interface ClearAction {
  type: 'CLEAR';
}

export interface ClearEntryAction {
  type: 'CLEAR_ENTRY';
}

export interface BackspaceAction {
  type: 'BACKSPACE';
}

export interface ScientificAction {
  type: 'SCIENTIFIC';
  payload: ScientificOperator;
}

export interface ToggleAngleAction {
  type: 'TOGGLE_ANGLE';
}

export interface ConstantAction {
  type: 'CONSTANT';
  payload: 'PI' | 'E';
}

export interface ParenthesisAction {
  type: 'PARENTHESIS';
  payload: '(' | ')';
}

export interface AddHistoryAction {
  type: 'ADD_HISTORY';
  payload: HistoryEntry;
}

export interface ClearHistoryAction {
  type: 'CLEAR_HISTORY';
}

export interface LoadFromHistoryAction {
  type: 'LOAD_FROM_HISTORY';
  payload: string;
}

export type CalculatorAction =
  | DigitAction
  | DecimalAction
  | OperatorAction
  | EqualsAction
  | ClearAction
  | ClearEntryAction
  | BackspaceAction
  | ScientificAction
  | ToggleAngleAction
  | ConstantAction
  | ParenthesisAction
  | AddHistoryAction
  | ClearHistoryAction
  | LoadFromHistoryAction;

// Calculator state
export interface CalculatorState {
  // Current display value
  display: string;

  // Expression being built (for display)
  expression: string;

  // Previous operand for binary operations
  previousValue: string | null;

  // Current operator waiting for second operand
  operator: BasicOperator | null;

  // Whether we're waiting for a new operand
  waitingForOperand: boolean;

  // Angle mode for trig functions
  angleMode: AngleMode;

  // Calculation history
  history: HistoryEntry[];

  // Error state
  error: string | null;

  // Parenthesis depth for expression parsing
  parenthesisCount: number;

  // Full expression for parenthesis mode
  fullExpression: string;
}

// Initial state
export const initialCalculatorState: CalculatorState = {
  display: '0',
  expression: '',
  previousValue: null,
  operator: null,
  waitingForOperand: false,
  angleMode: 'DEG',
  history: [],
  error: null,
  parenthesisCount: 0,
  fullExpression: '',
};

// Calculator context type
export interface CalculatorContextType {
  state: CalculatorState;
  dispatch: React.Dispatch<CalculatorAction>;
}
