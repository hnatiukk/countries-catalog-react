import { Logo } from '@/components/Logo';
import { FooterInner, FooterRoot } from './Footer.styles';

export function Footer() {
  return (
    <FooterRoot>
      <FooterInner>
        <Logo />
      </FooterInner>
    </FooterRoot>
  );
}
