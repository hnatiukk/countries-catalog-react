import { Route, Routes } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as countriesApi from '@/api/countriesApi';
import {
  countriesState,
  france,
  germany,
  ukraine,
} from '@/test/countryFixtures';
import { renderWithProviders } from '@/test/test-utils';
import { CountryDetailsContainer } from './CountryDetailsContainer';

jest.mock('@/api/countriesApi');

const mockedApi = countriesApi as jest.Mocked<typeof countriesApi>;

function renderCountry(code: string, initialEntries?: string[]) {
  return renderWithProviders(
    <Routes>
      <Route path="/country/:code" element={<CountryDetailsContainer />} />
      <Route path="/search/:query" element={<div>Search route</div>} />
      <Route path="/" element={<div>Home route</div>} />
    </Routes>,
    { initialEntries: initialEntries ?? [`/country/${code}`] },
  );
}

describe('CountryDetailsContainer', () => {
  beforeEach(() => {
    mockedApi.getCountryByCode.mockResolvedValue(ukraine);
    mockedApi.getRelatedCountries.mockResolvedValue([germany, france]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders country details and related countries', async () => {
    renderCountry('UKR');

    expect(
      await screen.findByRole('heading', { name: 'Ukraine' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Europe · Eastern Europe/)).toBeInTheDocument();
    expect(screen.getByText('28,700,000')).toBeInTheDocument();
    expect(screen.getByText('603,500 km²')).toBeInTheDocument();
    expect(
      screen.getByText(/More countries in the same region/),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: 'Germany' }),
    ).toBeInTheDocument();
  });

  it('shows not found for an unknown code', async () => {
    mockedApi.getCountryByCode.mockResolvedValue(null);

    renderCountry('ZZZ');

    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Go to search' }),
    ).toBeInTheDocument();
  });

  it('shows an error and retries details', async () => {
    const user = userEvent.setup();
    mockedApi.getCountryByCode
      .mockRejectedValueOnce(new Error('Details failed'))
      .mockResolvedValueOnce(ukraine);

    renderCountry('UKR');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Details failed',
    );
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(
      await screen.findByRole('heading', { name: 'Ukraine' }),
    ).toBeInTheDocument();
  });

  it('navigates back to search when the back button is pressed', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/country/:code" element={<CountryDetailsContainer />} />
        <Route path="/search/:query" element={<div>Search route</div>} />
      </Routes>,
      {
        initialEntries: ['/country/UKR'],
        preloadedState: {
          countries: countriesState({
            items: [ukraine],
            status: 'succeeded',
            hasSearched: true,
            lastSearch: { query: 'Ukraine', searchType: 'name' },
          }),
        },
      },
    );

    await screen.findByRole('heading', { name: 'Ukraine' });
    await user.click(screen.getByRole('button', { name: 'Back to search' }));

    expect(await screen.findByText('Search route')).toBeInTheDocument();
  });

  it('navigates to a related country card', async () => {
    const user = userEvent.setup();

    renderCountry('UKR');

    await user.click(await screen.findByRole('button', { name: 'France' }));

    await waitFor(() => {
      expect(mockedApi.getCountryByCode).toHaveBeenCalledWith(
        'FRA',
        expect.anything(),
      );
    });
  });

  it('loads related countries after details succeed', async () => {
    renderCountry('UKR');

    await waitFor(() => {
      expect(mockedApi.getRelatedCountries).toHaveBeenCalledWith(
        'Europe',
        'UKR',
        expect.anything(),
      );
    });
  });
});
