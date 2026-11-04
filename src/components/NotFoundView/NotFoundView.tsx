import { Button } from '@/components/Button';
import {
  NotFoundRoot,
  NotFoundText,
  NotFoundTitle,
} from './NotFoundView.styles';

export interface NotFoundViewProps {
  onGoHome: () => void;
  title?: string;
  message?: string;
}

export function NotFoundView({
  onGoHome,
  title = 'Page not found',
  message = 'The page you are looking for does not exist.',
}: NotFoundViewProps) {
  return (
    <NotFoundRoot role="status">
      <NotFoundTitle>{title}</NotFoundTitle>
      <NotFoundText>{message}</NotFoundText>
      <Button type="button" onClick={onGoHome}>
        Go to search
      </Button>
    </NotFoundRoot>
  );
}
