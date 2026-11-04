import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { store } from './app/store';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
