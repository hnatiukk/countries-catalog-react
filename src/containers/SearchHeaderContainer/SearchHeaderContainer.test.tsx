import { Route, Routes } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as countriesApi from '@/api/countriesApi';
import {
  france,
  germany,
  ukraine,
} from '@/test/countryFixtures';
import { renderWithProviders } from '@/test/test-utils';
import { SearchHeaderContainer } from './SearchHeaderContainer';

jest.mock('@/api/countriesApi');

const mockedApi = countriesApi as jest.Mocked<typeof countriesApi>;

function renderSearchHeader(initialEntries: string[] = ['/']) {
  return renderWithProviders(
    <Routes>
      <Route path="/" element={<SearchHeaderContainer />} />
      <Route path="/search/:query" element={<SearchHeaderContainer />} />
    </Routes>,
    { initialEntries },
  );
}

describe('SearchHeaderContainer', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('updates the query as the user types', async () => {
    const user = userEvent.setup();

    renderSearchHeader();

    const input = screen.getByRole('searchbox', { name: 'Search countries' });
    await user.type(input, 'Ukraine');

    expect(input).toHaveValue('Ukraine');
  });

  it('toggles search type from Name to Region', async () => {
    const user = userEvent.setup();
    const { store } = renderSearchHeader();

    await user.click(screen.getByRole('button', { name: 'Region' }));

    expect(store.getState().countries.searchType).toBe('region');
    expect(screen.getByRole('button', { name: 'Region' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('disables Search for an empty query', () => {
    renderSearchHeader();

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('searches by name on submit', async () => {
    const user = userEvent.setup();
    mockedApi.searchCountriesByName.mockResolvedValue([ukraine]);
    const { store } = renderSearchHeader();

    await user.type(
      screen.getByRole('searchbox', { name: 'Search countries' }),
      'Ukr',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(store.getState().countries.items.map((c) => c.cca3)).toEqual([
        'UKR',
      ]);
    });
    expect(mockedApi.searchCountriesByName).toHaveBeenCalledWith(
      'Ukr',
      expect.anything(),
    );
  });

  it('searches by region on submit', async () => {
    const user = userEvent.setup();
    mockedApi.searchCountriesByRegion.mockResolvedValue([
      ukraine,
      germany,
      france,
    ]);
    const { store } = renderSearchHeader();

    await user.click(screen.getByRole('button', { name: 'Region' }));
    await user.type(
      screen.getByRole('searchbox', { name: 'Search countries' }),
      'Europe',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(
        store.getState().countries.items.map((c) => c.cca3).sort(),
      ).toEqual(['DEU', 'FRA', 'UKR']);
    });
    expect(mockedApi.searchCountriesByRegion).toHaveBeenCalledWith(
      'Europe',
      expect.anything(),
    );
  });

  it('does nothing when submitting whitespace-only input', async () => {
    const user = userEvent.setup();
    const { store } = renderSearchHeader();

    await user.type(
      screen.getByRole('searchbox', { name: 'Search countries' }),
      '   ',
    );
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(mockedApi.searchCountriesByName).not.toHaveBeenCalled();
    expect(store.getState().countries.hasSearched).toBe(false);
  });

  it('prefills the input from the route query', async () => {
    mockedApi.searchCountriesByName.mockResolvedValue([ukraine]);

    renderSearchHeader(['/search/Ukraine']);

    expect(screen.getByRole('searchbox', { name: 'Search countries' })).toHaveValue(
      'Ukraine',
    );
    await waitFor(() => {
      expect(mockedApi.searchCountriesByName).toHaveBeenCalledWith(
        'Ukraine',
        expect.anything(),
      );
    });
  });
});
