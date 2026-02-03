import { createContext, useContext, type ReactNode } from 'react';
import type { CalculatorContextType } from '../types/calculator';
import { useCalculatorReducer } from '../hooks/useCalculator';

/**
 * Calculator context for sharing calculator state across components
 */
const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

/**
 * Props for CalculatorProvider component
 */
interface CalculatorProviderProps {
  children: ReactNode;
}

/**
 * Provider component that wraps the app and provides calculator state
 */
export function CalculatorProvider({ children }: CalculatorProviderProps) {
  const [state, dispatch] = useCalculatorReducer();

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  );
}

/**
 * Hook to access calculator context
 * Throws an error if used outside of CalculatorProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useCalculatorContext(): CalculatorContextType {
  const context = useContext(CalculatorContext);

  if (context === undefined) {
    throw new Error('useCalculatorContext must be used within a CalculatorProvider');
  }

  return context;
}
