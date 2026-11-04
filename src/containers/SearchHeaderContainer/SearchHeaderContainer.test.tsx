import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { SearchHeaderContainer } from './SearchHeaderContainer';

describe('SearchHeaderContainer', () => {
  it('updates the query as the user types', async () => {
    const user = userEvent.setup();

    renderWithProviders(<SearchHeaderContainer />);

    const input = screen.getByRole('searchbox', { name: 'Search countries' });
    await user.type(input, 'Ukraine');

    expect(input).toHaveValue('Ukraine');
  });

  it('toggles search type from Name to Region', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<SearchHeaderContainer />);

    await user.click(screen.getByRole('button', { name: 'Region' }));

    expect(store.getState().countries.searchType).toBe('region');
    expect(screen.getByRole('button', { name: 'Region' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('filters by name on submit', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<SearchHeaderContainer />);

    await user.type(
      screen.getByRole('searchbox', { name: 'Search countries' }),
      'Ukr',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(store.getState().countries.items.map((c) => c.cca3)).toEqual([
      'UKR',
    ]);
  });

  it('filters by exact region on submit', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<SearchHeaderContainer />);

    await user.click(screen.getByRole('button', { name: 'Region' }));
    await user.type(
      screen.getByRole('searchbox', { name: 'Search countries' }),
      'Europe',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(store.getState().countries.items.map((c) => c.cca3).sort()).toEqual(
      ['DEU', 'FRA', 'UKR'],
    );
  });

  it('clears results when submitting an empty query', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<SearchHeaderContainer />, {
      preloadedState: {
        countries: {
          items: [],
          status: 'succeeded',
          error: null,
          searchType: 'name',
          sortBy: 'population',
        },
      },
    });

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(store.getState().countries.items).toEqual([]);
  });
});
