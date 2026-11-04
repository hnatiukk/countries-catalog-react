import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { renderWithProviders } from '@/test/test-utils';

describe('App', () => {
  it('renders the search page heading', () => {
    renderWithProviders(<App />);

    expect(
      screen.getByRole('heading', { name: 'Find your country' }),
    ).toBeInTheDocument();
  });

  it('shows the empty results state by default', () => {
    renderWithProviders(<App />);

    expect(screen.getByText('0 countries found')).toBeInTheDocument();
    expect(screen.getByText('No results')).toBeInTheDocument();
  });

  it('opens a country page from a card and returns via back', async () => {
    const user = userEvent.setup();

    renderWithProviders(<App />);

    await user.type(
      screen.getByRole('searchbox', { name: 'Search countries' }),
      'Ukraine',
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.click(screen.getByRole('button', { name: 'Ukraine' }));

    expect(
      screen.getByRole('heading', { name: 'Ukraine' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to search' }));

    expect(
      screen.getByRole('heading', { name: 'Find your country' }),
    ).toBeInTheDocument();
  });
});
