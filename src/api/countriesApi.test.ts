import countryUkr from '@/test/fixtures/country-ukr.json';
import empty from '@/test/fixtures/empty.json';
import relatedEurope from '@/test/fixtures/related-europe.json';
import searchUkraine from '@/test/fixtures/search-name-ukraine.json';
import {
  getCountryByCode,
  getRelatedCountries,
  searchCountriesByName,
  searchCountriesByRegion,
} from './countriesApi';
import * as httpClient from './httpClient';

jest.mock('./httpClient', () => ({
  apiGet: jest.fn(),
}));

const apiGet = httpClient.apiGet as jest.MockedFunction<typeof httpClient.apiGet>;

describe('countriesApi', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('searchCountriesByName maps results and paginates while more=true', async () => {
    apiGet
      .mockResolvedValueOnce({
        data: {
          objects: searchUkraine.data.objects,
          meta: { total: 101, count: 100, limit: 100, offset: 0, more: true },
        },
      })
      .mockResolvedValueOnce({
        data: {
          objects: [],
          meta: { total: 101, count: 0, limit: 100, offset: 100, more: false },
        },
      });

    const result = await searchCountriesByName('ukraine');

    expect(apiGet).toHaveBeenCalledTimes(2);
    expect(apiGet.mock.calls[0]?.[0]).toMatchObject({
      query: expect.objectContaining({ q: 'ukraine', limit: 100, offset: 0 }),
    });
    expect(apiGet.mock.calls[1]?.[0]).toMatchObject({
      query: expect.objectContaining({ offset: 100 }),
    });
    expect(result[0]?.name.common).toBe('Ukraine');
  });

  it('searchCountriesByName returns [] for blank query without calling the API', async () => {
    await expect(searchCountriesByName('   ')).resolves.toEqual([]);
    expect(apiGet).not.toHaveBeenCalled();
  });

  it('searchCountriesByRegion returns an empty list for empty API results', async () => {
    apiGet.mockResolvedValueOnce(empty);

    await expect(searchCountriesByRegion('foobar')).resolves.toEqual([]);
    expect(apiGet).toHaveBeenCalledWith(
      expect.objectContaining({
        query: expect.objectContaining({ region: 'foobar' }),
      }),
    );
  });

  it('getCountryByCode returns details or null', async () => {
    apiGet.mockResolvedValueOnce(countryUkr);
    const details = await getCountryByCode('UKR');
    expect(details?.cca3).toBe('UKR');
    expect(details?.capital).toEqual(['Kyiv']);

    apiGet.mockResolvedValueOnce(empty);
    await expect(getCountryByCode('ZZZ')).resolves.toBeNull();
    await expect(getCountryByCode('')).resolves.toBeNull();
  });

  it('getRelatedCountries excludes the current code and keeps top 6 by population', async () => {
    apiGet.mockResolvedValueOnce({
      data: {
        objects: relatedEurope.data.objects,
        meta: { total: 10, count: 10, limit: 100, offset: 0, more: false },
      },
    });

    const related = await getRelatedCountries('Europe', 'ALB');
    expect(related).toHaveLength(6);
    expect(related.every((country) => country.cca3 !== 'ALB')).toBe(true);
    for (let i = 1; i < related.length; i += 1) {
      expect(related[i - 1]!.population).toBeGreaterThanOrEqual(
        related[i]!.population,
      );
    }
  });
});
