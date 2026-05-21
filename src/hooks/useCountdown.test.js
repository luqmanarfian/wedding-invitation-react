import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountdown } from './useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns zero-padded values when target date is in the future', () => {
    // Set "now" to a fixed time
    vi.setSystemTime(new Date('2026-06-10T00:00:00'));

    const { result } = renderHook(() => useCountdown('2026-06-12T11:30:00'));

    // Should return non-zero days
    expect(Number(result.current.days)).toBeGreaterThan(0);
    expect(result.current.hours).toMatch(/^\d{2}$/);
    expect(result.current.minutes).toMatch(/^\d{2}$/);
    expect(result.current.seconds).toMatch(/^\d{2}$/);
  });

  it('returns all zeros when target date is in the past', () => {
    vi.setSystemTime(new Date('2027-01-01T00:00:00'));

    const { result } = renderHook(() => useCountdown('2026-06-12T11:30:00'));

    expect(result.current.days).toBe('00');
    expect(result.current.hours).toBe('00');
    expect(result.current.minutes).toBe('00');
    expect(result.current.seconds).toBe('00');
  });

  it('updates countdown every second', () => {
    vi.setSystemTime(new Date('2026-06-12T11:29:50'));

    const { result } = renderHook(() => useCountdown('2026-06-12T11:30:00'));

    const initialSeconds = result.current.seconds;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Seconds should have changed
    expect(result.current.seconds).not.toBe(initialSeconds);
  });

  it('pads single-digit values with leading zero', () => {
    vi.setSystemTime(new Date('2026-06-12T11:29:55'));

    const { result } = renderHook(() => useCountdown('2026-06-12T11:30:00'));

    expect(result.current.seconds).toMatch(/^\d{2}$/);
    expect(result.current.minutes).toMatch(/^\d{2}$/);
  });

  it('cleans up interval on unmount', () => {
    vi.setSystemTime(new Date('2026-06-10T00:00:00'));

    const { unmount } = renderHook(() => useCountdown('2026-06-12T11:30:00'));

    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
