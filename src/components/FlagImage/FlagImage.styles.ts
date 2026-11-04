import styled from 'styled-components';

export const Flag = styled.img<{ $large?: boolean }>`
  width: 100%;
  aspect-ratio: ${({ $large }) => ($large ? '3 / 2' : '16 / 10')};
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.lightGray};
  border-radius: ${({ theme }) => theme.radii.sm};
`;
