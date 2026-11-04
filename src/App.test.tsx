import App from './App';
import { renderWithProviders } from '@/test/test-utils';

describe('App', () => {
  it('renders the Countries Catalog heading', () => {
    const { getByRole } = renderWithProviders(<App />);

    expect(
      getByRole('heading', { name: 'Countries Catalog' }),
    ).toBeInTheDocument();
  });
});
