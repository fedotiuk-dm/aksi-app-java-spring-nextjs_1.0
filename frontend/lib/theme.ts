import { createTheme, ThemeOptions } from '@mui/material/styles';
import { Geist } from 'next/font/google';

// Завантаження шрифту Geist із Google Fonts
export const geistSans = Geist({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  fallback: ['sans-serif'],
});

// Основні кольори додатку
const colors = {
  primary: {
    main: '#1C6EA4', // Основний синій
    light: '#4D9FD3',
    dark: '#114C7A',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FF9800', // Оранжевий для акцентів
    light: '#FFB74D',
    dark: '#F57C00',
    contrastText: '#000000',
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
    default: '#F9FAFB',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
  },
};

// Конфігурація теми
const themeOptions: ThemeOptions = {
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    success: colors.success,
    error: colors.error,
    background: colors.background,
    text: colors.text,
  },
  typography: {
    fontFamily: geistSans.style.fontFamily,
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
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
          ':hover': {
            boxShadow: '0px 4px 8px rgba(28, 110, 164, 0.15)',
          },
        },
        containedPrimary: {
          backgroundColor: colors.primary.main,
          color: colors.primary.contrastText,
        },
        containedSecondary: {
          backgroundColor: colors.secondary.main,
          color: colors.secondary.contrastText,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: 16,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          '& .MuiTableCell-root': {
            fontWeight: 600,
          },
        },
      },
    },
  },
};

// Створення темою із типізованою конфігурацією
export const theme = createTheme(themeOptions);
