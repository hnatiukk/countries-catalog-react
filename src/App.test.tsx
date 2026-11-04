import App from './App';
import { renderWithProviders } from '@/test/test-utils';

describe('App', () => {
  it('renders the search page heading', () => {
    const { getByRole } = renderWithProviders(<App />);

    expect(
      getByRole('heading', { name: 'Find your country' }),
    ).toBeInTheDocument();
  });

  it('shows the empty results state by default', () => {
    const { getByText } = renderWithProviders(<App />);

    expect(getByText('0 countries found')).toBeInTheDocument();
    expect(getByText('No results')).toBeInTheDocument();
  });
});
