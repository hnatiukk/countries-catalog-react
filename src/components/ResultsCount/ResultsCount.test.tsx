import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/test-utils';
import { ResultsCount } from './ResultsCount';

describe('ResultsCount', () => {
  it('matches snapshot for zero', () => {
    const { container } = renderWithTheme(<ResultsCount count={0} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for a non-zero count', () => {
    const { container } = renderWithTheme(<ResultsCount count={10} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the count text', () => {
    renderWithTheme(<ResultsCount count={5} />);

    expect(screen.getByText('5 countries found')).toBeInTheDocument();
  });
});
