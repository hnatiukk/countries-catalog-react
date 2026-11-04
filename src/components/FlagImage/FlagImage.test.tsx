import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/test-utils';
import { FlagImage } from './FlagImage';

describe('FlagImage', () => {
  it('matches snapshot for the normal size', () => {
    const { container } = renderWithTheme(
      <FlagImage
        src="https://flagcdn.com/w320/ua.png"
        alt="Flag of Ukraine"
        countryName="Ukraine"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot for the large size', () => {
    const { container } = renderWithTheme(
      <FlagImage
        src="https://flagcdn.com/w320/ua.png"
        alt="Flag of Ukraine"
        countryName="Ukraine"
        large
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('falls back to a generated alt when alt is missing', () => {
    renderWithTheme(
      <FlagImage src="https://flagcdn.com/w320/ua.png" countryName="Ukraine" />,
    );

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Flag of Ukraine');
  });

  it('falls back when alt is blank', () => {
    renderWithTheme(
      <FlagImage
        src="https://flagcdn.com/w320/ua.png"
        alt="   "
        countryName="Ukraine"
      />,
    );

    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Flag of Ukraine');
  });
});
