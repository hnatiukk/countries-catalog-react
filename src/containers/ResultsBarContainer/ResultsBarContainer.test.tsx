import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MOCK_COUNTRIES } from '@/features/countries/mockData';
import { renderWithProviders } from '@/test/test-utils';
import { ResultsBarContainer } from './ResultsBarContainer';

describe('ResultsBarContainer', () => {
  it('shows the count from the store', () => {
    renderWithProviders(<ResultsBarContainer />, {
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

    expect(screen.getByText('3 countries found')).toBeInTheDocument();
  });

  it('updates sortBy when switching to Area', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ResultsBarContainer />);

    expect(screen.getByRole('button', { name: 'Population' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('button', { name: 'Area' }));

    expect(store.getState().countries.sortBy).toBe('area');
    expect(screen.getByRole('button', { name: 'Area' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });
});
