import { useState } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/test/test-utils';
import { SearchInput } from './SearchInput';

function ControlledSearchInput() {
  const [value, setValue] = useState('');

  return (
    <SearchInput value={value} onChange={setValue} label="Search countries" />
  );
}

describe('SearchInput', () => {
  it('matches snapshot', () => {
    const { container } = renderWithTheme(
      <SearchInput
        value=""
        onChange={() => {}}
        label="Search countries"
        placeholder="Enter country name or region"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('is labelled for accessibility', () => {
    renderWithTheme(
      <SearchInput value="" onChange={() => {}} label="Search countries" />,
    );

    expect(
      screen.getByRole('searchbox', { name: 'Search countries' }),
    ).toBeInTheDocument();
  });

  it('calls onChange with the typed value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderWithTheme(
      <SearchInput value="" onChange={onChange} label="Search countries" />,
    );

    await user.type(
      screen.getByRole('searchbox', { name: 'Search countries' }),
      'ab',
    );

    expect(onChange).toHaveBeenCalledWith('a');
    expect(onChange).toHaveBeenCalledWith('b');
  });

  it('updates a controlled value as the user types', async () => {
    const user = userEvent.setup();

    renderWithTheme(<ControlledSearchInput />);

    const input = screen.getByRole('searchbox', { name: 'Search countries' });
    await user.type(input, 'Ukraine');

    expect(input).toHaveValue('Ukraine');
  });
});
