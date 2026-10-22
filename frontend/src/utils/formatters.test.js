import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  calculateDaysBetween,
  formatDurationMinutes
} from './formatters';

describe('formatters utility', () => {
  it('formats USD currency correctly', () => {
    expect(formatCurrency(1500, 'USD')).toContain('1,500');
    expect(formatCurrency(0, 'USD')).toContain('0');
  });

  it('formats EUR currency correctly', () => {
    const formatted = formatCurrency(2400, 'EUR');
    expect(formatted).toMatch(/2,400|2.400/);
  });

  it('calculates days between dates inclusively', () => {
    expect(calculateDaysBetween('2026-11-10', '2026-11-14')).toBe(5);
    expect(calculateDaysBetween('2026-11-10', '2026-11-10')).toBe(1);
  });

  it('formats duration in minutes nicely', () => {
    expect(formatDurationMinutes(60)).toBe('1 hr');
    expect(formatDurationMinutes(120)).toBe('2 hrs');
    expect(formatDurationMinutes(90)).toBe('1h 30m');
    expect(formatDurationMinutes(45)).toBe('45 mins');
  });
});
