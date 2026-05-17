import React from 'react';
import { useMusic } from '../context/MusicContext';

/**
 * MusicButton — Floating action button to toggle background music.
 * Spins when playing, pauses animation when muted.
 * Hidden until the invitation is opened.
 */
export default function MusicButton({ visible }) {
  const { isPlaying, toggle } = useMusic();

  if (!visible) return null;

  return (
    <button
      id="music-btn"
      onClick={toggle}
      className={`bg-blush-400 text-white p-3 rounded-full shadow-lg hover:bg-blush-500 transition-colors focus:outline-none ${
        !isPlaying ? 'paused' : ''
      }`}
      aria-label={isPlaying ? 'Pause musik' : 'Putar musik'}
    >
      <i className={`fas ${isPlaying ? 'fa-music' : 'fa-volume-mute'} text-xl`}></i>
    </button>
  );
}
