import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MOCK_COUNTRIES } from '@/features/countries/mockData';
import { renderWithProviders } from '@/test/test-utils';
import { CountryGridContainer } from './CountryGridContainer';

describe('CountryGridContainer', () => {
  it('shows the empty state when there are no items', () => {
    renderWithProviders(<CountryGridContainer />);

    expect(screen.getByRole('status')).toHaveTextContent('No results');
  });

  it('renders sorted cards from the store', () => {
    renderWithProviders(<CountryGridContainer />, {
      preloadedState: {
        countries: {
          items: MOCK_COUNTRIES.slice(0, 3),
          status: 'succeeded',
          error: null,
          searchType: 'name',
          sortBy: 'population',
        },
      },
    });

    // Ukraine, United States, Germany — sorted by population desc
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
          countries: {
            items: MOCK_COUNTRIES.slice(0, 1),
            status: 'succeeded',
            error: null,
            searchType: 'name',
            sortBy: 'population',
          },
        },
      },
    );

    await user.click(screen.getByRole('button', { name: 'Ukraine' }));

    expect(onCountryClick).toHaveBeenCalledWith('UKR');
  });
});
