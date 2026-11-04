import type { ChangeEvent } from 'react';
import { Field, Input, Label } from './SearchInput.styles';

export interface SearchInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function SearchInput({
  id = 'search-input',
  value,
  onChange,
  placeholder = 'Search…',
  label = 'Search query',
}: SearchInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Field>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
      />
    </Field>
  );
}
