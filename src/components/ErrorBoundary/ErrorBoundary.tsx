import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '@/utils/logger';
import {
  FallbackMessage,
  FallbackRoot,
  FallbackTitle,
  RetryButton,
} from './ErrorBoundary.styles';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('ErrorBoundary caught a render error', {
      error,
      componentStack: errorInfo.componentStack,
    });
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <FallbackRoot role="alert">
          <FallbackTitle>Something went wrong</FallbackTitle>
          <FallbackMessage>
            An unexpected error occurred while rendering this section. You can
            try again.
          </FallbackMessage>
          <RetryButton type="button" onClick={this.handleRetry}>
            Try again
          </RetryButton>
        </FallbackRoot>
      );
    }

    return this.props.children;
  }
}
