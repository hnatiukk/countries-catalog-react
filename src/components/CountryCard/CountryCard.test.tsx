import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/test/test-utils';
import { CountryCard } from './CountryCard';

const defaultProps = {
  name: 'Ukraine',
  flagPng: 'https://flagcdn.com/w320/ua.png',
  flagAlt: 'Flag of Ukraine',
  population: 44134693,
  region: 'Europe',
};

describe('CountryCard', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(<CountryCard {...defaultProps} />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('exposes the country name as accessible name', () => {
    renderWithTheme(<CountryCard {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: 'Ukraine' }),
    ).toBeInTheDocument();
  });

  it('calls onClick when pressed', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    renderWithTheme(<CountryCard {...defaultProps} onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'Ukraine' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
