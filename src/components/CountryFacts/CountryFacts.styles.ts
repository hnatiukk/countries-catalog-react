import styled from 'styled-components';

export const FactsList = styled.dl`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const FactRow = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.md};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

export const FactLabel = styled.dt`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const FactValue = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.textOnDark};
`;
