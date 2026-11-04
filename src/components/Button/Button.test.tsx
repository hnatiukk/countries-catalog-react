import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/test/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(<Button>Search</Button>);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    renderWithTheme(<Button onClick={onClick}>Search</Button>);

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders as submit when type is submit', () => {
    renderWithTheme(<Button type="submit">Search</Button>);

    expect(screen.getByRole('button', { name: 'Search' })).toHaveAttribute(
      'type',
      'submit',
    );
  });
});
