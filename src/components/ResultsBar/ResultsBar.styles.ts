import styled from 'styled-components';

export const Bar = styled.div`
  background-color: ${({ theme }) => theme.colors.resultsBar};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const BarInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;
