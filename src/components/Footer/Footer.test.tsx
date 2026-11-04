import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/test-utils';
import { Footer } from './Footer';

describe('Footer', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(<Footer />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders the brand logo text', () => {
    renderWithTheme(<Footer />);

    expect(screen.getByText('countriescatalog')).toBeInTheDocument();
  });
});
