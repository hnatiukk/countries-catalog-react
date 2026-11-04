import { EmptyMessage, EmptyRoot } from './EmptyState.styles';

export interface EmptyStateProps {
  message?: string;
}

export function EmptyState({ message = 'No results' }: EmptyStateProps) {
  return (
    <EmptyRoot role="status">
      <EmptyMessage>{message}</EmptyMessage>
    </EmptyRoot>
  );
}
