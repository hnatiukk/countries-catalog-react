export const theme = {
  colors: {
    accent: '#e63956',
    accentPink: '#ff6b8a',
    dark: '#1a1a2e',
    lightGray: '#f0f0f5',
    white: '#ffffff',
    text: '#2b2b2b',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    xxl: '2rem',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
} as const;

export type AppTheme = typeof theme;
