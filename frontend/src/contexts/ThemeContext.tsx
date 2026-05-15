import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface ThemeType {
  mode: 'light' | 'dark';
  colors: {
    bg: string;
    bgSecondary: string;
    text: string;
    textSecondary: string;
    primary: string;
    primaryLight: string;
    accent: string;
    border: string;
    shadow: string;
    cardBg: string;
  };
}

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setMode: (mode: 'light' | 'dark') => void;
}

const lightTheme: ThemeType = {
  mode: 'light',
  colors: {
    bg: '#f5f7fa',
    bgSecondary: '#ffffff',
    text: '#1a202c',
    textSecondary: '#4a5568',
    primary: '#48bb78',
    primaryLight: '#9ae6b4',
    accent: '#667eea',
    border: '#e2e8f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    cardBg: '#ffffff',
  },
};

const darkTheme: ThemeType = {
  mode: 'dark',
  colors: {
    bg: '#1a202c',
    bgSecondary: '#2d3748',
    text: '#f5f7fa',
    textSecondary: '#cbd5e0',
    primary: '#48bb78',
    primaryLight: '#9ae6b4',
    accent: '#667eea',
    border: '#4a5568',
    shadow: 'rgba(0, 0, 0, 0.3)',
    cardBg: '#2d3748',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  const theme = mode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = () => {
    setModeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setMode = (newMode: 'light' | 'dark') => {
    setModeState(newMode);
  };

  const value = {
    theme,
    toggleTheme,
    setMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
