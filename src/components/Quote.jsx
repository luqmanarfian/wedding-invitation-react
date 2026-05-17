import React from 'react';
import { QUOTE } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Quote — Displays a Quran verse (or any quote) in a glassmorphism card.
 */
export default function Quote() {
  const ref = useScrollReveal();

  return (
    <section className="py-20 bg-blush-50 px-4 text-center">
      <div ref={ref} className="max-w-3xl mx-auto fade-in-section glass-card p-10 rounded-2xl">
        <i className="fas fa-quote-left text-3xl text-blush-300 mb-6"></i>
        <p className="font-serif text-xl md:text-2xl text-text-main leading-relaxed italic mb-6">
          {QUOTE.text}
        </p>
        <p className="text-text-light font-semibold">{QUOTE.source}</p>
      </div>
    </section>
  );
}
