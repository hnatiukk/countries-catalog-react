import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/test-utils';
import { SectionTitleBar } from './SectionTitleBar';

describe('SectionTitleBar', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(
      <SectionTitleBar
        prefix="More countries in the same region"
        emphasis="Europe"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders prefix and emphasis', () => {
    renderWithTheme(
      <SectionTitleBar
        prefix="More countries in the same region"
        emphasis="Europe"
      />,
    );

    expect(
      screen.getByText(/More countries in the same region/),
    ).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
  });
});
