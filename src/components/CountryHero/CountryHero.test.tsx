import { renderWithTheme } from '@/test/test-utils';
import { CountryHero } from './CountryHero';

const baseProps = {
  name: 'Ukraine',
  flagPng: 'https://flagcdn.com/w320/ua.png',
  flagAlt: 'Flag of Ukraine',
  region: 'Europe',
  subregion: 'Eastern Europe',
  populationLabel: '44,134,693',
  areaLabel: '603,500 km²',
};

describe('CountryHero', () => {
  it('matches snapshot with facts', () => {
    const { container } = renderWithTheme(
      <CountryHero
        {...baseProps}
        facts={[
          { label: 'Capital', value: 'Kyiv' },
          { label: 'Languages', value: 'Ukrainian' },
          { label: 'Currencies', value: 'Ukrainian hryvnia (₴)' },
        ]}
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot without facts', () => {
    const { container } = renderWithTheme(
      <CountryHero {...baseProps} facts={[]} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
