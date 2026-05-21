import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGuestName } from './useGuestName';

describe('useGuestName', () => {
  const originalLocation = globalThis.location;

  afterEach(() => {
    // Restore original location
    Object.defineProperty(globalThis, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('returns decoded guest name from ?to= parameter', () => {
    Object.defineProperty(globalThis, 'location', {
      value: { ...originalLocation, search: '?to=Budi+Santoso' },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGuestName());
    expect(result.current).toBe('Budi Santoso');
  });

  it('returns default name when ?to= parameter is absent', () => {
    Object.defineProperty(globalThis, 'location', {
      value: { ...originalLocation, search: '' },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGuestName());
    expect(result.current).toBe('Tamu Undangan');
  });

  it('returns default name when query is empty', () => {
    Object.defineProperty(globalThis, 'location', {
      value: { ...originalLocation, search: '?other=value' },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGuestName());
    expect(result.current).toBe('Tamu Undangan');
  });

  it('handles encoded characters in guest name', () => {
    Object.defineProperty(globalThis, 'location', {
      value: { ...originalLocation, search: '?to=Ahmad%20Fauzi' },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useGuestName());
    expect(result.current).toBe('Ahmad Fauzi');
  });
});
