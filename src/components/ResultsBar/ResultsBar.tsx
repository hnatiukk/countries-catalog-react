import type { ReactNode } from 'react';
import { Bar, BarInner } from './ResultsBar.styles';

export interface ResultsBarProps {
  countSlot: ReactNode;
  sortSlot: ReactNode;
}

export function ResultsBar({ countSlot, sortSlot }: ResultsBarProps) {
  return (
    <Bar>
      <BarInner>
        {countSlot}
        {sortSlot}
      </BarInner>
    </Bar>
  );
}
