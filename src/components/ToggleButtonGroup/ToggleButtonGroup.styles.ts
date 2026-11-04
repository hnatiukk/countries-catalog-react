import styled, { css } from 'styled-components';

export type ToggleVariant = 'accent' | 'underline';

export const Group = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const GroupLabel = styled.span`
  color: inherit;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

export const Options = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ToggleButton = styled.button<{
  $active: boolean;
  $variant: ToggleVariant;
}>`
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: inherit;
  transition:
    color 0.15s ease,
    font-weight 0.15s ease,
    border-color 0.15s ease;

  ${({ $variant, $active, theme }) =>
    $variant === 'accent'
      ? css`
          color: ${$active ? theme.colors.accent : 'inherit'};
          font-weight: ${$active
            ? theme.fontWeights.bold
            : theme.fontWeights.regular};
          opacity: ${$active ? 1 : 0.85};

          &:hover {
            color: ${theme.colors.accent};
          }
        `
      : css`
          font-weight: ${$active
            ? theme.fontWeights.bold
            : theme.fontWeights.regular};
          border-bottom: 2px solid
            ${$active ? theme.colors.accent : 'transparent'};
          border-radius: 0;
          padding-bottom: 2px;

          &:hover {
            color: ${theme.colors.accent};
          }
        `}

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accent};
    outline-offset: 2px;
  }
`;
