import styled from 'styled-components';

export const FooterRoot = styled.footer`
  margin-top: auto;
  background-color: ${({ theme }) => theme.colors.footer};
  color: ${({ theme }) => theme.colors.textOnDark};
`;

export const FooterInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
`;
