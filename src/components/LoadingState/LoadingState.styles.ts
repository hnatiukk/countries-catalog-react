import styled from 'styled-components';

export const LoadingRoot = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xxl} ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
`;

export const LoadingMessage = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textMuted};
`;
