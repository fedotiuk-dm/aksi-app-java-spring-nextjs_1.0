'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { createTheme, ThemeProvider, PaletteMode } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { Geist } from 'next/font/google';

// Font configuration
const geistSans = Geist({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['sans-serif'],
});

// Theme context
interface ThemeContextProps {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: 'light',
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

// Theme colors function
const getColors = (mode: PaletteMode) => ({
  primary: {
    main: mode === 'light' ? '#1C6EA4' : '#4D9FD3',
    light: '#4D9FD3',
    dark: '#114C7A',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: mode === 'light' ? '#000000' : '#FFFFFF',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  background: {
    default: mode === 'light' ? '#F9FAFB' : '#121212',
    paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
  },
  text: {
    primary: mode === 'light' ? '#212121' : '#FFFFFF',
    secondary: mode === 'light' ? '#757575' : '#B3B3B3',
    disabled: mode === 'light' ? '#9E9E9E' : '#666666',
  },
});

// Create theme function
const createAppTheme = (mode: PaletteMode) => {
  const colors = getColors(mode);
  
  return createTheme({
    palette: {
      mode,
      primary: colors.primary,
      secondary: colors.secondary,
      success: colors.success,
      error: colors.error,
      background: colors.background,
      text: colors.text,
    },
    typography: {
      fontFamily: geistSans.style.fontFamily,
      h1: { fontSize: '2.5rem', fontWeight: 700 },
      h2: { fontSize: '2rem', fontWeight: 600 },
      h3: { fontSize: '1.75rem', fontWeight: 600 },
      h4: { fontSize: '1.5rem', fontWeight: 600 },
      h5: { fontSize: '1.25rem', fontWeight: 600 },
      h6: { fontSize: '1rem', fontWeight: 600 },
      subtitle1: { fontSize: '1rem', fontWeight: 500 },
      subtitle2: { fontSize: '0.875rem', fontWeight: 500 },
      body1: { fontSize: '1rem' },
      body2: { fontSize: '0.875rem' },
      button: { textTransform: 'none', fontWeight: 500 },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            padding: '8px 16px',
            boxShadow: 'none',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.9375rem',
            ':hover': { boxShadow: '0px 4px 8px rgba(28, 110, 164, 0.15)' },
          },
          contained: {
            '&.MuiButton-containedPrimary': {
              backgroundColor: colors.primary.main,
              color: colors.primary.contrastText,
            },
            '&.MuiButton-containedSecondary': {
              backgroundColor: colors.secondary.main,
              color: colors.secondary.contrastText,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'light' 
              ? '0px 4px 12px rgba(0, 0, 0, 0.05)'
              : '0px 4px 12px rgba(0, 0, 0, 0.3)',
            borderRadius: 12,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            ...(mode === 'dark' && {
              backgroundImage: 'none',
              backgroundColor: colors.background.paper,
            }),
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundColor: colors.primary.main },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: colors.background.paper,
            color: colors.text.primary,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: { backgroundColor: colors.background.paper },
        },
      },
      MuiSelect: {
        styleOverrides: {
          select: {
            backgroundColor: mode === 'dark' ? colors.background.paper : 'transparent',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: { marginBottom: 16 },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: colors.background.paper,
            '& .MuiTableCell-root': { fontWeight: 600 },
          },
        },
      },
    },
  });
};

// Main theme provider component
export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as PaletteMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setMode(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('theme', newMode);
  };

  const theme = React.useMemo(() => createAppTheme(mode), [mode]);

  // Emotion cache setup for MUI
  const options = { key: 'mui', prepend: true };
  const [{ cache, flush }] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    const inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = [...inserted];
      inserted.length = 0;
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) return null;
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <CacheProvider value={cache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </CacheProvider>
    </ThemeContext.Provider>
  );
};