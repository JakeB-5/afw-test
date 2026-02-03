import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Detects user's system color scheme preference
 * @returns 'light' | 'dark'
 */
function getSystemTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * ThemeProvider component that manages theme state and persistence
 * - Persists theme to localStorage
 * - Detects system preference on first load
 * - Sets data-theme attribute on document.documentElement
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  // Get system theme preference on mount
  const systemTheme = getSystemTheme();

  // Use localStorage hook with system theme as fallback
  const [theme, setTheme] = useLocalStorage<Theme>('theme', systemTheme);

  // Update document data-theme attribute when theme changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Toggle between light and dark - using useCallback would be overkill
  // since the context provider rarely re-renders
  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme: () => setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light')),
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

/**
 * Hook to consume theme context
 * @throws Error if used outside ThemeProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
