export function formatNumber(value: number): string {
  return value.toLocaleString('en-US');
}

export function formatArea(value: number): string {
  return `${formatNumber(value)} km²`;
}
