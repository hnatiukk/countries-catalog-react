import { Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import * as countriesApi from '@/api/countriesApi';
import { france, germany, ukraine } from '@/test/countryFixtures';
import { renderWithProviders } from '@/test/test-utils';
import { CountryPage } from './CountryPage';

jest.mock('@/api/countriesApi');

const mockedApi = countriesApi as jest.Mocked<typeof countriesApi>;

describe('CountryPage', () => {
  beforeEach(() => {
    mockedApi.getCountryByCode.mockResolvedValue(ukraine);
    mockedApi.getRelatedCountries.mockResolvedValue([germany, france]);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders country landmarks for the given code', async () => {
    renderWithProviders(
      <Routes>
        <Route path="/country/:code" element={<CountryPage />} />
      </Routes>,
      { initialEntries: ['/country/UKR'] },
    );

    expect(
      await screen.findByRole('heading', { name: 'Ukraine' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Back to search' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/More countries in the same region/),
    ).toBeInTheDocument();
  });
});
