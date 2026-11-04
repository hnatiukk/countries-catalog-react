import { formatArea, formatNumber } from './format';

describe('formatNumber', () => {
  it('formats zero', () => {
    expect(formatNumber(0)).toBe('0');
  });

  it('formats a typical population with grouping separators', () => {
    expect(formatNumber(44134693)).toBe('44,134,693');
  });

  it('formats a very large number', () => {
    expect(formatNumber(1380004385)).toBe('1,380,004,385');
  });
});

describe('formatArea', () => {
  it('appends the km² unit', () => {
    expect(formatArea(603500)).toBe('603,500 km²');
  });

  it('formats zero area', () => {
    expect(formatArea(0)).toBe('0 km²');
  });
});
