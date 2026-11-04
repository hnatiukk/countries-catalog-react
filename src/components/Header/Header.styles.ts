import styled from 'styled-components';

export const HeaderRoot = styled.header`
  position: relative;
  min-height: ${({ theme }) => theme.layout.headerMinHeight};
  color: ${({ theme }) => theme.colors.textOnDark};
  background-color: ${({ theme }) => theme.colors.dark};
  background-image:
    linear-gradient(
      ${({ theme }) => theme.colors.heroOverlay},
      ${({ theme }) => theme.colors.heroOverlay}
    ),
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.03) 10px,
      rgba(255, 255, 255, 0.03) 20px
    ),
    radial-gradient(
      circle at 20% 20%,
      rgba(246, 82, 97, 0.18),
      transparent 45%
    ),
    radial-gradient(
      circle at 80% 10%,
      rgba(255, 255, 255, 0.08),
      transparent 40%
    );
  background-size: cover;
`;

export const HeaderInner = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md}
    ${({ theme }) => theme.spacing.xxl};
`;

export const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;
