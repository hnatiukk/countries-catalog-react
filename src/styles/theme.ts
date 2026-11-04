export const theme = {
  colors: {
    accent: '#F65261',
    accentHover: '#e04452',
    dark: '#1f1f1f',
    heroOverlay: 'rgba(20, 20, 20, 0.78)',
    footer: '#2b2b2b',
    lightGray: '#f5f5f5',
    resultsBar: '#ebebeb',
    white: '#ffffff',
    text: '#333333',
    textMuted: '#777777',
    textOnDark: '#ffffff',
    border: '#dddddd',
    factHighlight: 'rgba(246, 82, 97, 0.12)',
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
    xl: '1.75rem',
    xxl: '2.5rem',
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    bold: 700,
  },
  radii: {
    sm: '4px',
    md: '8px',
  },
  shadows: {
    card: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  layout: {
    maxWidth: '1200px',
    headerMinHeight: '360px',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
} as const;

export type AppTheme = typeof theme;
