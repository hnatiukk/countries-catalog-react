import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@/test/test-utils';
import { ToggleButtonGroup } from './ToggleButtonGroup';

const options = [
  { value: 'name' as const, label: 'Name' },
  { value: 'region' as const, label: 'Region' },
];

describe('ToggleButtonGroup', () => {
  it('matches snapshot with Name active (accent)', () => {
    const { container } = renderWithTheme(
      <ToggleButtonGroup
        label="Search by"
        options={options}
        value="name"
        onChange={() => {}}
        variant="accent"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('matches snapshot with Region active (underline)', () => {
    const { container } = renderWithTheme(
      <ToggleButtonGroup
        label="Search by"
        options={options}
        value="region"
        onChange={() => {}}
        variant="underline"
      />,
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it('sets aria-pressed on the active option', () => {
    renderWithTheme(
      <ToggleButtonGroup
        label="Search by"
        options={options}
        value="name"
        onChange={() => {}}
      />,
    );

    expect(screen.getByRole('button', { name: 'Name' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Region' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('calls onChange with the selected value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    renderWithTheme(
      <ToggleButtonGroup
        label="Search by"
        options={options}
        value="name"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Region' }));

    expect(onChange).toHaveBeenCalledWith('region');
  });
});
