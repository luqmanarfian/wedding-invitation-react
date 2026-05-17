import React from 'react';
import CoupleCard from './CoupleCard';
import { COUPLE } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Couple — Displays both bride and groom profiles side by side.
 */
export default function Couple() {
  const ref = useScrollReveal();

  return (
    <section className="py-24 bg-white px-4">
      <div ref={ref} className="max-w-5xl mx-auto text-center fade-in-section">
        <h2 className="font-serif text-4xl md:text-5xl text-blush-900 mb-4 font-bold">
          Mempelai
        </h2>
        <p className="text-text-light mb-16">
          Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan
          putra-putri kami:
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
          <CoupleCard {...COUPLE.groom} />

          {/* Ampersand divider */}
          <div className="text-5xl font-serif text-blush-300 md:mb-12">&amp;</div>

          <CoupleCard {...COUPLE.bride} />
        </div>
      </div>
    </section>
  );
}
