import { screen } from '@testing-library/react';
import { renderWithTheme } from '@/test/test-utils';
import { Header } from './Header';

describe('Header', () => {
  it('matches snapshot with children', () => {
    const { container } = renderWithTheme(
      <Header>
        <h1>Find your country</h1>
      </Header>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with actions', () => {
    const { container } = renderWithTheme(
      <Header actions={<button type="button">Back</button>}>
        <h1>Ukraine</h1>
      </Header>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders actions when provided', () => {
    renderWithTheme(
      <Header actions={<button type="button">Back</button>} />,
    );

    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });
});
