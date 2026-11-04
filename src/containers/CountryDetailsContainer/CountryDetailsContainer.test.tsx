import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as countriesApi from '@/api/countriesApi';
import { france, germany, ukraine } from '@/test/countryFixtures';
import { renderWithProviders } from '@/test/test-utils';
import { CountryDetailsContainer } from './CountryDetailsContainer';

jest.mock('@/api/countriesApi');

const mockedApi = countriesApi as jest.Mocked<typeof countriesApi>;

describe('CountryDetailsContainer', () => {
  beforeEach(() => {
    mockedApi.getCountryByCode.mockResolvedValue(ukraine);
    mockedApi.getRelatedCountries.mockResolvedValue([germany, france]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders country details and related countries', async () => {
    renderWithProviders(
      <CountryDetailsContainer countryCode="UKR" onBack={() => undefined} />,
    );

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

    renderWithProviders(
      <CountryDetailsContainer countryCode="ZZZ" onBack={() => undefined} />,
    );

    expect(await screen.findByText('Country not found')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Country not found');
  });

  it('shows an error and retries details', async () => {
    const user = userEvent.setup();
    mockedApi.getCountryByCode
      .mockRejectedValueOnce(new Error('Details failed'))
      .mockResolvedValueOnce(ukraine);

    renderWithProviders(
      <CountryDetailsContainer countryCode="UKR" onBack={() => undefined} />,
    );

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Details failed',
    );
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(
      await screen.findByRole('heading', { name: 'Ukraine' }),
    ).toBeInTheDocument();
  });

  it('calls onBack when the back button is pressed', async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();

    renderWithProviders(
      <CountryDetailsContainer countryCode="UKR" onBack={onBack} />,
    );

    await screen.findByRole('heading', { name: 'Ukraine' });
    await user.click(screen.getByRole('button', { name: 'Back to search' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('calls onCountryClick for a related country card', async () => {
    const user = userEvent.setup();
    const onCountryClick = jest.fn();

    renderWithProviders(
      <CountryDetailsContainer
        countryCode="UKR"
        onBack={() => undefined}
        onCountryClick={onCountryClick}
      />,
    );

    await user.click(await screen.findByRole('button', { name: 'France' }));

    expect(onCountryClick).toHaveBeenCalledWith('FRA');
  });

  it('loads related countries after details succeed', async () => {
    renderWithProviders(
      <CountryDetailsContainer countryCode="UKR" onBack={() => undefined} />,
    );

    await waitFor(() => {
      expect(mockedApi.getRelatedCountries).toHaveBeenCalledWith(
        'Europe',
        'UKR',
        expect.anything(),
      );
    });
  });
});
