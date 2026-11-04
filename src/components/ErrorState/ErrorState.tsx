import { Button } from '@/components/Button';
import { ErrorMessage, ErrorRoot } from './ErrorState.styles';

export interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
}

export function ErrorState({
  message,
  onRetry,
  retryLabel = 'Try again',
}: ErrorStateProps) {
  return (
    <ErrorRoot role="alert">
      <ErrorMessage>{message}</ErrorMessage>
      <Button type="button" onClick={onRetry}>
        {retryLabel}
      </Button>
    </ErrorRoot>
  );
}
