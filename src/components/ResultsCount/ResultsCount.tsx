import { CountText } from './ResultsCount.styles';

export interface ResultsCountProps {
  count: number;
}

export function ResultsCount({ count }: ResultsCountProps) {
  const label = count === 1 ? 'country' : 'countries';

  return (
    <CountText>
      {count} {label} found
    </CountText>
  );
}
