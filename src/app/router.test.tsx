import { useLocation } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as countriesApi from '@/api/countriesApi';
import { france, germany, ukraine } from '@/test/countryFixtures';
import { renderWithProviders } from '@/test/test-utils';
import { AppRoutes } from './router';

jest.mock('@/api/countriesApi');

const mockedApi = countriesApi as jest.Mocked<typeof countriesApi>;

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderApp(initialEntries: string[]) {
  return renderWithProviders(
    <>
      <AppRoutes />
      <LocationProbe />
    </>,
    { initialEntries },
  );
}

describe('AppRoutes', () => {
  beforeEach(() => {
    mockedApi.searchCountriesByName.mockResolvedValue([ukraine]);
    mockedApi.searchCountriesByRegion.mockResolvedValue([
      ukraine,
      germany,
      france,
    ]);
    mockedApi.getCountryByCode.mockResolvedValue(ukraine);
    mockedApi.getRelatedCountries.mockResolvedValue([germany, france]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows the empty search page on / without requesting', () => {
    renderApp(['/']);

    expect(screen.getByText('0 countries found')).toBeInTheDocument();
    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/');
    expect(mockedApi.searchCountriesByName).not.toHaveBeenCalled();
    expect(mockedApi.searchCountriesByRegion).not.toHaveBeenCalled();
  });

  it('navigates to /search/:query on submit', async () => {
    const user = userEvent.setup();

    renderApp(['/']);

    await user.type(
      screen.getByRole('searchbox', { name: 'Search countries' }),
      'Ukraine',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(await screen.findByRole('button', { name: 'Ukraine' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/search/Ukraine');
  });

  it('runs the search and prefills the input from a direct /search/:query URL', async () => {
    renderApp(['/search/Ukraine']);

    expect(
      screen.getByRole('searchbox', { name: 'Search countries' }),
    ).toHaveValue('Ukraine');
    expect(await screen.findByRole('button', { name: 'Ukraine' })).toBeInTheDocument();
    expect(mockedApi.searchCountriesByName).toHaveBeenCalledWith(
      'Ukraine',
      expect.anything(),
    );
  });

  it('opens country details from a card via /country/:code', async () => {
    const user = userEvent.setup();

    renderApp(['/search/Ukraine']);

    await user.click(await screen.findByRole('button', { name: 'Ukraine' }));

    expect(
      await screen.findByRole('heading', { name: 'Ukraine' }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('/country/UKR');
    expect(mockedApi.getCountryByCode).toHaveBeenCalledWith(
      'UKR',
      expect.anything(),
    );
  });

  it('shows 404 for unknown paths and returns home', async () => {
    const user = userEvent.setup();

    renderApp(['/does-not-exist']);

    expect(
      screen.getByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Go to search' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/');
    expect(
      screen.getByRole('heading', { name: 'Find your country' }),
    ).toBeInTheDocument();
  });

  it('shows 404 for an unknown country code', async () => {
    mockedApi.getCountryByCode.mockResolvedValue(null);

    renderApp(['/country/ZZZ']);

    expect(
      await screen.findByRole('heading', { name: 'Page not found' }),
    ).toBeInTheDocument();
  });

  it('keeps the URL unchanged when toggling search type or sort', async () => {
    const user = userEvent.setup();

    renderApp(['/search/Europe']);

    await screen.findByRole('button', { name: 'Ukraine' });
    expect(screen.getByTestId('location')).toHaveTextContent('/search/Europe');

    await user.click(screen.getByRole('button', { name: 'Region' }));
    await user.click(screen.getByRole('button', { name: 'Area' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/search/Europe');
  });
});
