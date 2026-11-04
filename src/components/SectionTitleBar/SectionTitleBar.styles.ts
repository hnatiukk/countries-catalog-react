import styled from 'styled-components';

export const Strip = styled.div`
  background-color: ${({ theme }) => theme.colors.resultsBar};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StripInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
`;

export const Title = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  color: ${({ theme }) => theme.colors.text};
`;

export const Emphasis = styled.strong`
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`;
