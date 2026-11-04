import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { CountryDetailsContainer } from './CountryDetailsContainer';

describe('CountryDetailsContainer', () => {
  it('renders country details and related countries', () => {
    renderWithProviders(
      <CountryDetailsContainer countryCode="UKR" onBack={() => {}} />,
    );

    expect(
      screen.getByRole('heading', { name: 'Ukraine' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Europe · Eastern Europe/)).toBeInTheDocument();
    expect(screen.getByText('44,134,693')).toBeInTheDocument();
    expect(screen.getByText('603,500 km²')).toBeInTheDocument();
    expect(
      screen.getByText(/More countries in the same region/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Germany' }),
    ).toBeInTheDocument();
  });

  it('shows not found for an unknown code', () => {
    renderWithProviders(
      <CountryDetailsContainer countryCode="ZZZ" onBack={() => {}} />,
    );

    expect(screen.getByRole('status')).toHaveTextContent('Country not found');
  });

  it('calls onBack when the back button is pressed', async () => {
    const user = userEvent.setup();
    const onBack = jest.fn();

    renderWithProviders(
      <CountryDetailsContainer countryCode="UKR" onBack={onBack} />,
    );

    await user.click(screen.getByRole('button', { name: 'Back to search' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('calls onCountryClick for a related country card', async () => {
    const user = userEvent.setup();
    const onCountryClick = jest.fn();

    renderWithProviders(
      <CountryDetailsContainer
        countryCode="UKR"
        onBack={() => {}}
        onCountryClick={onCountryClick}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'France' }));

    expect(onCountryClick).toHaveBeenCalledWith('FRA');
  });
});
