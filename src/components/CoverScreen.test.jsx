import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CoverScreen from './CoverScreen';

vi.mock('../data/content', () => ({
  HERO: { backgroundImage: '/images/test.jpg', title: 'Test & Couple' },
}));

describe('CoverScreen', () => {
  it('renders guest name and open button', () => {
    render(<CoverScreen guestName="Alice" onOpen={vi.fn()} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Buka Undangan')).toBeInTheDocument();
    expect(screen.getByText('Undangan Pernikahan')).toBeInTheDocument();
  });

  it('renders couple title from content data', () => {
    render(<CoverScreen guestName="Alice" onOpen={vi.fn()} />);
    expect(screen.getByText('Test & Couple')).toBeInTheDocument();
  });

  it('calls onOpen when button is clicked', () => {
    const onOpen = vi.fn();
    render(<CoverScreen guestName="Alice" onOpen={onOpen} />);

    fireEvent.click(screen.getByText('Buka Undangan'));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('adds opened class after button click', () => {
    render(<CoverScreen guestName="Alice" onOpen={vi.fn()} />);

    const container = screen.getByText('Buka Undangan').closest('.cover-screen');
    expect(container.className).not.toContain('opened');

    fireEvent.click(screen.getByText('Buka Undangan'));
    expect(container.className).toContain('opened');
  });

  it('removes from DOM after animation timeout', () => {
    vi.useFakeTimers();
    const { container } = render(<CoverScreen guestName="Alice" onOpen={vi.fn()} />);

    fireEvent.click(screen.getByText('Buka Undangan'));

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should render null after timeout
    expect(container.firstChild).toBeNull();

    vi.useRealTimers();
  });

  it('renders Kepada Yth. text', () => {
    render(<CoverScreen guestName="Bob" onOpen={vi.fn()} />);
    expect(screen.getByText('Kepada Yth.')).toBeInTheDocument();
  });
});
