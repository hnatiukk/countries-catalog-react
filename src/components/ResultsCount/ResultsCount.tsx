import { CountText } from './ResultsCount.styles';

export interface ResultsCountProps {
  count: number;
}

export function ResultsCount({ count }: ResultsCountProps) {
  return <CountText>{count} countries found</CountText>;
}
