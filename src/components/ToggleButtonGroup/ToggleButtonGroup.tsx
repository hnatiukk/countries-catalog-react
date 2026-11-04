import {
  Group,
  GroupLabel,
  Options,
  ToggleButton,
  type ToggleVariant,
} from './ToggleButtonGroup.styles';

export interface ToggleOption<T extends string> {
  value: T;
  label: string;
}

export interface ToggleButtonGroupProps<T extends string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  variant?: ToggleVariant;
  'aria-label'?: string;
}

export function ToggleButtonGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  variant = 'accent',
  'aria-label': ariaLabel,
}: ToggleButtonGroupProps<T>) {
  return (
    <Group role="group" aria-label={ariaLabel ?? label}>
      {label ? <GroupLabel>{label}</GroupLabel> : null}
      <Options>
        {options.map((option) => {
          const isActive = option.value === value;

          return (
            <ToggleButton
              key={option.value}
              type="button"
              $active={isActive}
              $variant={variant}
              aria-pressed={isActive}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </ToggleButton>
          );
        })}
      </Options>
    </Group>
  );
}
