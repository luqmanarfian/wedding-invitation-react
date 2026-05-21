import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MusicButton from './MusicButton';

const mockToggle = vi.fn();
vi.mock('../context/MusicContext', () => ({
  useMusic: () => ({
    isPlaying: false,
    toggle: mockToggle,
  }),
}));

describe('MusicButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when visible is false', () => {
    const { container } = render(<MusicButton visible={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders button when visible is true', () => {
    render(<MusicButton visible={true} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls toggle on click', () => {
    render(<MusicButton visible={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label when paused', () => {
    render(<MusicButton visible={true} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Putar musik');
  });

  it('has music-btn id', () => {
    render(<MusicButton visible={true} />);
    expect(screen.getByRole('button').id).toBe('music-btn');
  });
});
