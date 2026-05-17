import React from 'react';
import { HERO } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Hero — Full-screen parallax hero section.
 * Shows couple names, wedding date, and a bouncing scroll indicator.
 */
export default function Hero() {
  const ref = useScrollReveal();

  return (
    <section
      className="relative h-screen flex items-center justify-center parallax bg-cover bg-center"
      style={{ backgroundImage: `url('${HERO.backgroundImage}')` }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div ref={ref} className="relative z-10 text-center text-white px-4 fade-in-section">
        <h3 className="text-lg md:text-xl tracking-widest mb-4 font-light">
          {HERO.subtitle}
        </h3>
        <h1 className="font-serif text-6xl md:text-8xl font-bold mb-4 drop-shadow-lg">
          {HERO.title}
        </h1>
        <p className="text-xl md:text-2xl mt-4 tracking-wider">{HERO.date}</p>
        <div className="mt-8 animate-bounce">
          <i className="fas fa-chevron-down text-2xl opacity-75"></i>
        </div>
      </div>
    </section>
  );
}
