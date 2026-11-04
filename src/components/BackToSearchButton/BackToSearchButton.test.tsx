import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/test/test-utils';
import { BackToSearchButton } from './BackToSearchButton';

describe('BackToSearchButton', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(
      <BackToSearchButton onClick={() => {}} />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    renderWithTheme(<BackToSearchButton onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'Back to search' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
