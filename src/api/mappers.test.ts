import countryUkr from '@/test/fixtures/country-ukr.json';
import searchEurope from '@/test/fixtures/search-region-europe.json';
import { mapCountries, mapCountry, mapCountryDetails } from './mappers';
import type { CountryDto } from './types';

describe('mappers', () => {
  it('maps a real UKR detail fixture', () => {
    const dto = countryUkr.data.objects[0] as CountryDto;
    const details = mapCountryDetails(dto);

    expect(details).toMatchObject({
      name: { common: 'Ukraine' },
      cca3: 'UKR',
      region: 'Europe',
      subregion: 'Eastern Europe',
      population: 28700000,
      area: 603500,
      capital: ['Kyiv'],
      languages: { ukr: 'Ukrainian' },
      currencies: {
        UAH: { name: 'Ukrainian hryvnia', symbol: '₴' },
      },
    });
    expect(details.flags.png).toContain('ua.png');
    expect(details.flags.alt).toMatch(/Ukraine/);
  });

  it('maps a list fixture to Country cards', () => {
    const countries = mapCountries(searchEurope.data.objects as CountryDto[]);
    expect(countries.length).toBe(6);
    expect(countries[0]).toMatchObject({
      name: { common: expect.any(String) },
      cca3: expect.any(String),
      region: 'Europe',
      population: expect.any(Number),
      area: expect.any(Number),
    });
  });

  it('uses safe fallbacks for missing fields', () => {
    const country = mapCountry({});
    expect(country).toEqual({
      name: { common: 'Unknown' },
      cca3: '',
      flags: { png: '', svg: '' },
      region: '',
      population: 0,
      area: 0,
    });
  });

  it('maps details with empty languages and currencies arrays', () => {
    const details = mapCountryDetails({
      names: { common: 'Nowhere' },
      codes: { alpha_3: 'xxx' },
      languages: [],
      currencies: [{ name: 'Credit', code: '' }],
      capitals: [{ name: '  ' }, { name: 'Capital City' }],
    });

    expect(details.cca3).toBe('XXX');
    expect(details.capital).toEqual(['Capital City']);
    expect(details.languages).toEqual({});
    expect(details.currencies).toEqual({
      cur_0: { name: 'Credit' },
    });
  });

  it('ignores null dto', () => {
    expect(mapCountry(null).name.common).toBe('Unknown');
    expect(mapCountryDetails(undefined).subregion).toBe('');
  });
});
