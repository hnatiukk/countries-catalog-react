import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as countriesApi from '@/api/countriesApi';
import {
  countriesState,
  germany,
  ukraine,
  unitedStates,
} from '@/test/countryFixtures';
import { renderWithProviders } from '@/test/test-utils';
import { CountryGridContainer } from './CountryGridContainer';

jest.mock('@/api/countriesApi');

const mockedApi = countriesApi as jest.Mocked<typeof countriesApi>;

describe('CountryGridContainer', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows the empty state when there are no items', () => {
    renderWithProviders(<CountryGridContainer />);

    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });

  it('shows a loading state', () => {
    renderWithProviders(<CountryGridContainer />, {
      preloadedState: {
        countries: countriesState({ status: 'loading', hasSearched: true }),
      },
    });

    expect(screen.getByRole('status')).toHaveTextContent('Loading countries…');
  });

  it('shows an error state and retries the last search', async () => {
    const user = userEvent.setup();
    mockedApi.searchCountriesByName.mockResolvedValue([ukraine]);

    const { store } = renderWithProviders(<CountryGridContainer />, {
      preloadedState: {
        countries: countriesState({
          status: 'failed',
          error: 'Boom',
          hasSearched: true,
          lastSearch: { query: 'Ukraine', searchType: 'name' },
        }),
      },
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(mockedApi.searchCountriesByName).toHaveBeenCalledWith(
      'Ukraine',
      expect.anything(),
    );
    await waitFor(() => {
      expect(store.getState().countries.status).toBe('succeeded');
    });
    expect(store.getState().countries.items).toEqual([ukraine]);
  });

  it('renders sorted cards from the store', () => {
    renderWithProviders(<CountryGridContainer />, {
      preloadedState: {
        countries: countriesState({
          items: [ukraine, unitedStates, germany],
          status: 'succeeded',
          hasSearched: true,
        }),
      },
    });

    const cards = screen.getAllByRole('button');
    expect(cards[0]).toHaveAccessibleName('United States');
    expect(cards[1]).toHaveAccessibleName('Germany');
    expect(cards[2]).toHaveAccessibleName('Ukraine');
  });

  it('calls onCountryClick with the country code', async () => {
    const user = userEvent.setup();
    const onCountryClick = jest.fn();

    renderWithProviders(
      <CountryGridContainer onCountryClick={onCountryClick} />,
      {
        preloadedState: {
          countries: countriesState({
            items: [ukraine],
            status: 'succeeded',
            hasSearched: true,
          }),
        },
      },
    );

    await user.click(screen.getByRole('button', { name: 'Ukraine' }));

    expect(onCountryClick).toHaveBeenCalledWith('UKR');
  });
});
