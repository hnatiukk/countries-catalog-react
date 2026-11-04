import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/test-utils';
import { Logo } from './Logo';

describe('Logo', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(<Logo />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the brand name', () => {
    renderWithTheme(<Logo />);

    expect(screen.getByText('countriescatalog')).toBeInTheDocument();
  });
});
