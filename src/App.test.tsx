import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as countriesApi from '@/api/countriesApi';
import { AppRoutes } from '@/app/router';
import { france, germany, ukraine } from '@/test/countryFixtures';
import { renderWithProviders } from '@/test/test-utils';

jest.mock('@/api/countriesApi');

const mockedApi = countriesApi as jest.Mocked<typeof countriesApi>;

describe('App', () => {
  beforeEach(() => {
    mockedApi.searchCountriesByName.mockResolvedValue([ukraine]);
    mockedApi.getCountryByCode.mockResolvedValue(ukraine);
    mockedApi.getRelatedCountries.mockResolvedValue([germany, france]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the search page heading', () => {
    renderWithProviders(<AppRoutes />);

    expect(
      screen.getByRole('heading', { name: 'Find your country' }),
    ).toBeInTheDocument();
  });

  it('shows the empty results state by default', () => {
    renderWithProviders(<AppRoutes />);

    expect(screen.getByText('0 countries found')).toBeInTheDocument();
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('opens a country page from a card and returns via back', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AppRoutes />);

    await user.type(
      screen.getByRole('searchbox', { name: 'Search countries' }),
      'Ukraine',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await user.click(await screen.findByRole('button', { name: 'Ukraine' }));

    expect(
      await screen.findByRole('heading', { name: 'Ukraine' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to search' }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Find your country' }),
      ).toBeInTheDocument();
    });
  });
});
