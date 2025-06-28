import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const stored = localStorage.getItem('rafiq-theme') as Theme;
    if (stored && ['light', 'dark'].includes(stored)) {
      return stored;
    }
    // Default to light mode
    return 'light';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    const updateTheme = () => {
      setResolvedTheme(theme);
      
      // Apply theme to document
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
      
      // Update color-scheme for better browser integration
      root.style.colorScheme = theme;
      
      // Store theme preference
      localStorage.setItem('rafiq-theme', theme);
    };

    updateTheme();
  }, [theme]);

  // Prevent flash of unstyled content
  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--initial-color-mode', resolvedTheme);
  }, [resolvedTheme]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}