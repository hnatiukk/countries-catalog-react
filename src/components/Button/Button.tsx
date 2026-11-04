import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { StyledButton } from './Button.styles';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function Button({ children, type = 'button', ...rest }: ButtonProps) {
  return (
    <StyledButton type={type} {...rest}>
      {children}
    </StyledButton>
  );
}
