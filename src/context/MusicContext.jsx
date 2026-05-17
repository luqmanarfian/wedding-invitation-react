import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import { AUDIO_SRC } from '../data/content';

/**
 * MusicContext provides global music playback state and controls.
 * Uses a single <audio> element shared across the app.
 *
 * - `isPlaying`: current playback state
 * - `play()`: start playback (requires prior user interaction)
 * - `toggle()`: toggle play/pause
 */
const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch((err) => {
      console.log('Autoplay ditolak oleh browser:', err);
    });
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log('Play gagal:', err);
      });
    }
  }, [isPlaying]);

  return (
    <MusicContext.Provider value={{ isPlaying, play, toggle }}>
      {/* Hidden audio element — managed entirely via context */}
      <audio ref={audioRef} loop preload="auto">
        <source src={AUDIO_SRC} type="audio/mpeg" />
      </audio>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}
