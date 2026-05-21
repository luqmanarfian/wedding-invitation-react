import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MusicProvider, useMusic } from './MusicContext';

/** Test consumer that exposes music controls */
function TestConsumer() {
  const { isPlaying, play, toggle } = useMusic();
  return (
    <>
      <span data-testid="status">{isPlaying ? 'playing' : 'paused'}</span>
      <button onClick={play}>Play</button>
      <button onClick={toggle}>Toggle</button>
    </>
  );
}

describe('MusicContext', () => {
  it('renders children and audio element', () => {
    render(
      <MusicProvider>
        <div>child</div>
      </MusicProvider>
    );
    expect(screen.getByText('child')).toBeInTheDocument();
  });

  it('starts with isPlaying = false', () => {
    render(
      <MusicProvider>
        <TestConsumer />
      </MusicProvider>
    );
    expect(screen.getByTestId('status')).toHaveTextContent('paused');
  });

  it('play() calls audio.play()', async () => {
    const playMock = vi.fn().mockResolvedValue(undefined);

    // Mock HTMLAudioElement.prototype.play
    HTMLMediaElement.prototype.play = playMock;

    render(
      <MusicProvider>
        <TestConsumer />
      </MusicProvider>
    );

    fireEvent.click(screen.getByText('Play'));
    expect(playMock).toHaveBeenCalled();
  });

  it('toggle() calls audio.pause() when playing', async () => {
    const playMock = vi.fn().mockResolvedValue(undefined);
    const pauseMock = vi.fn();
    HTMLMediaElement.prototype.play = playMock;
    HTMLMediaElement.prototype.pause = pauseMock;

    render(
      <MusicProvider>
        <TestConsumer />
      </MusicProvider>
    );

    // First play
    fireEvent.click(screen.getByText('Play'));

    // Wait for state update
    await vi.waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('playing');
    });

    // Now toggle should pause
    fireEvent.click(screen.getByText('Toggle'));
    expect(pauseMock).toHaveBeenCalled();
  });

  it('handles play() rejection gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    HTMLMediaElement.prototype.play = vi.fn().mockRejectedValue(new Error('Not allowed'));

    render(
      <MusicProvider>
        <TestConsumer />
      </MusicProvider>
    );

    fireEvent.click(screen.getByText('Play'));

    await vi.waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Autoplay'),
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('throws error when useMusic is used outside provider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useMusic must be used within a MusicProvider');

    consoleSpy.mockRestore();
  });
});
