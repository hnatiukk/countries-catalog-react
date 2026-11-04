import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Country } from '@/features/countries/types';
import { renderWithTheme } from '@/test/test-utils';
import { CountryGrid } from './CountryGrid';

const countries: Country[] = [
  {
    name: { common: 'Ukraine' },
    cca3: 'UKR',
    flags: { png: 'https://flagcdn.com/w320/ua.png', svg: 'https://flagcdn.com/ua.svg' },
    region: 'Europe',
    population: 44134693,
    area: 603500,
  },
  {
    name: { common: 'Germany' },
    cca3: 'DEU',
    flags: { png: 'https://flagcdn.com/w320/de.png', svg: 'https://flagcdn.com/de.svg' },
    region: 'Europe',
    population: 83240525,
    area: 357114,
  },
];

describe('CountryGrid', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(
      <CountryGrid countries={countries} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('calls onCountryClick with the country code', async () => {
    const user = userEvent.setup();
    const onCountryClick = jest.fn();

    renderWithTheme(
      <CountryGrid countries={countries} onCountryClick={onCountryClick} />,
    );

    await user.click(screen.getByRole('button', { name: 'Germany' }));

    expect(onCountryClick).toHaveBeenCalledWith('DEU');
  });
});
