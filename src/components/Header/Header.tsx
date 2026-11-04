import type { ReactNode } from 'react';
import {
  HeaderContent,
  HeaderInner,
  HeaderRoot,
  HeaderTop,
} from './Header.styles';
import { Logo } from '@/components/Logo';

export interface HeaderProps {
  children?: ReactNode;
  actions?: ReactNode;
}

export function Header({ children, actions }: HeaderProps) {
  return (
    <HeaderRoot>
      <HeaderInner>
        <HeaderTop>
          <Logo />
          {actions}
        </HeaderTop>
        {children ? <HeaderContent>{children}</HeaderContent> : null}
      </HeaderInner>
    </HeaderRoot>
  );
}
