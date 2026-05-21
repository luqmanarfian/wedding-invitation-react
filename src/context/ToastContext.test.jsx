import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ToastProvider, useToast } from './ToastContext';

/** Test consumer component that exposes showToast via a button */
function TestConsumer() {
  const { showToast } = useToast();
  return (
    <>
      <button onClick={() => showToast('Title', 'Message')}>Success Toast</button>
      <button onClick={() => showToast('Error', 'Fail', 'error')}>Error Toast</button>
    </>
  );
}

describe('ToastContext', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children', () => {
    render(
      <ToastProvider>
        <div>child content</div>
      </ToastProvider>
    );
    expect(screen.getByText('child content')).toBeInTheDocument();
  });

  it('shows toast notification when showToast is called', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Success Toast').click();
    });

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('shows error toast with error styling', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Error Toast').click();
    });

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Fail')).toBeInTheDocument();
    // Check that error border class is applied
    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('border-red-500');
  });

  it('auto-hides toast after timeout', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Success Toast').click();
    });

    const alert = screen.getByRole('alert');
    expect(alert.className).toContain('show');

    act(() => {
      vi.advanceTimersByTime(4000);
    });

    expect(alert.className).not.toContain('show');
    vi.useRealTimers();
  });

  it('uses longer delay for error toasts', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>
    );

    act(() => {
      screen.getByText('Error Toast').click();
    });

    const alert = screen.getByRole('alert');

    // After 3 seconds, should still be visible (error uses 5s delay)
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(alert.className).toContain('show');

    // After 5 seconds total, should be hidden
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    expect(alert.className).not.toContain('show');

    vi.useRealTimers();
  });

  it('throws error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useToast must be used within a ToastProvider');

    consoleSpy.mockRestore();
  });
});
