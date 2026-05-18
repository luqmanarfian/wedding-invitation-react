import React, { useState } from 'react';
import { HERO } from '../data/content';

/**
 * CoverScreen — Layar pembuka undangan.
 * Menampilkan nama tamu dan tombol "Buka Undangan".
 * Saat dibuka, cover slide ke atas lalu di-unmount dari DOM.
 */
export default function CoverScreen({ guestName, onOpen }) {
  const [opened, setOpened] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleOpen = () => {
    setOpened(true);
    onOpen();

    // Remove from DOM after animation completes (1s transition)
    setTimeout(() => setHidden(true), 1000);
  };

  if (hidden) return null;

  return (
    <div
      className={`cover-screen flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-center bg-cover ${
        opened ? 'opened' : ''
      }`}
      style={{
        backgroundImage: `linear-gradient(rgba(253, 242, 248, 0.8), rgba(253, 242, 248, 0.9)), url('${HERO.backgroundImage}')`,
      }}
    >
      <div className="glass-card p-10 md:p-16 rounded-3xl text-center max-w-lg mx-4 ornament-corner relative z-10">
        <h3 className="text-sm tracking-widest uppercase text-blush-500 mb-4">
          Undangan Pernikahan
        </h3>
        <h1 className="font-serif text-5xl md:text-6xl text-blush-900 mb-6 font-bold">
          {HERO.title}
        </h1>
        <p className="text-lg mb-8 italic text-text-light">
          Kepada Yth.
          <br />
          <strong className="text-blush-800 not-italic text-xl block mt-2">
            {guestName}
          </strong>
        </p>
        <button
          onClick={handleOpen}
          className="bg-blush-400 hover:bg-blush-500 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_4px_14px_0_rgba(244,114,182,0.39)]"
        >
          <i className="fas fa-envelope-open mr-2"></i>
          Buka Undangan
        </button>
      </div>
    </div>
  );
}