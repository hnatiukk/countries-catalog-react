import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/test-utils';
import { ResultsBar } from './ResultsBar';

describe('ResultsBar', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(
      <ResultsBar
        countSlot={<span>3 countries found</span>}
        sortSlot={<span>Sort by</span>}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders both slots', () => {
    renderWithTheme(
      <ResultsBar
        countSlot={<span>3 countries found</span>}
        sortSlot={<span>Sort controls</span>}
      />,
    );

    expect(screen.getByText('3 countries found')).toBeInTheDocument();
    expect(screen.getByText('Sort controls')).toBeInTheDocument();
  });
});
