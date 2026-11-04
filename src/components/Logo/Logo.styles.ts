import styled from 'styled-components';

export const LogoText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: -0.02em;
  text-transform: lowercase;
  line-height: 1;
`;
