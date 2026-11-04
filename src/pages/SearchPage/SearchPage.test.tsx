import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { SearchPage } from './SearchPage';

describe('SearchPage', () => {
  it('renders key landmarks', () => {
    renderWithProviders(<SearchPage />);

    expect(
      screen.getByRole('heading', { name: 'Find your country' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('searchbox', { name: 'Search countries' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Search by' })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Sort by' })).toBeInTheDocument();
    expect(screen.getByText('0 countries found')).toBeInTheDocument();
  });
});
