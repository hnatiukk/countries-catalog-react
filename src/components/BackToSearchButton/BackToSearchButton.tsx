import { IconButton } from './BackToSearchButton.styles';

export interface BackToSearchButtonProps {
  onClick: () => void;
}

export function BackToSearchButton({ onClick }: BackToSearchButtonProps) {
  return (
    <IconButton type="button" onClick={onClick} aria-label="Back to search">
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.65" y1="16.65" x2="21" y2="21" />
      </svg>
    </IconButton>
  );
}
