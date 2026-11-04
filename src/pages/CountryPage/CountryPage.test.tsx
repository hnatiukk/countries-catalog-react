import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { CountryPage } from './CountryPage';

describe('CountryPage', () => {
  it('renders country landmarks for the given code', () => {
    renderWithProviders(
      <CountryPage
        countryCode="UKR"
        onBack={() => {}}
        onCountryClick={() => {}}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Ukraine' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Back to search' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/More countries in the same region/),
    ).toBeInTheDocument();
  });
});
