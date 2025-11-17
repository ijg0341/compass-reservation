import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { koKR } from '@mui/material/locale';

const baseTheme = createTheme(
  {
    palette: {
      mode: 'light',
      primary: {
        main: '#E63C2E',
        light: '#FF4433',
        dark: '#C42E20',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#757575',
        light: '#BDBDBD',
        dark: '#424242',
        contrastText: '#FFFFFF',
      },
      background: {
        default: '#FAFAFA',
        paper: '#FFFFFF',
      },
      text: {
        primary: '#212121',
        secondary: '#757575',
      },
      divider: 'rgba(0, 0, 0, 0.08)',
    },
    typography: {
      fontFamily: [
        'Pretendard',
        '-apple-system',
        'BlinkMacSystemFont',
        'system-ui',
        'Roboto',
        '"Helvetica Neue"',
        '"Segoe UI"',
        '"Apple SD Gothic Neo"',
        '"Noto Sans KR"',
        '"Malgun Gothic"',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2rem',
      },
      h2: {
        fontWeight: 700,
        fontSize: '1.75rem',
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.5rem',
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.25rem',
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.125rem',
      },
      h6: {
        fontWeight: 600,
        fontSize: '1rem',
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: Array(25).fill('none') as unknown as typeof baseTheme.shadows,
    components: {
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 8,
            padding: '12px 24px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
          sizeLarge: {
            minHeight: 52,
            fontSize: '1rem',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            minWidth: 44,
            minHeight: 44,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              minHeight: 44,
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            boxShadow: 'none',
            border: 'none',
            borderRadius: 8,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          },
        },
      },
      MuiBottomNavigation: {
        styleOverrides: {
          root: {
            height: 64,
          },
        },
      },
      MuiBottomNavigationAction: {
        styleOverrides: {
          root: {
            minWidth: 44,
            paddingTop: 8,
            paddingBottom: 8,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            minHeight: 44,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            minHeight: 44,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            border: '1px solid #E0E0E0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            border: '1px solid #E0E0E0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
  },
  koKR
);

export const theme = responsiveFontSizes(baseTheme);
