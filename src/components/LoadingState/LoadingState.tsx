import { LoadingMessage, LoadingRoot } from './LoadingState.styles';

export interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading…' }: LoadingStateProps) {
  return (
    <LoadingRoot role="status" aria-live="polite" aria-busy="true">
      <LoadingMessage>{message}</LoadingMessage>
    </LoadingRoot>
  );
}
