import React from 'react';
import Countdown from './Countdown';
import EventCard from './EventCard';
import { EVENTS, MAPS, HERO } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Event — Jadwal Acara section.
 * Assembles Countdown, EventCards (Akad + Resepsi), and Google Maps embed.
 */
export default function Event() {
  const ref = useScrollReveal();

  return (
    <section
      className="py-24 bg-white px-4 parallax relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('${HERO.backgroundImage}')`,
      }}
    >
      <div ref={ref} className="max-w-5xl mx-auto fade-in-section">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl text-blush-900 mb-4 font-bold">
            Jadwal Acara
          </h2>
          <p className="text-text-light text-lg">
            Dengan hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir pada acara pernikahan
            kami.
          </p>
        </div>

        {/* Countdown to wedding */}
        <Countdown />

        {/* Event cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EVENTS.map((event, index) => (
            <EventCard key={event.id} {...event} isFirst={index === 0} />
          ))}
        </div>

        {/* Google Maps embed */}
        <div className="mt-12 rounded-2xl overflow-hidden shadow-lg border border-blush-100">
          <iframe
            src={MAPS.embedUrl}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Pernikahan"
          ></iframe>
        </div>

        <div className="text-center mt-6">
          <a
            href={MAPS.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blush-500 hover:bg-blush-600 text-white py-3 px-6 rounded-full font-semibold transition-colors shadow-md"
          >
            <i className="fas fa-map-marker-alt mr-2"></i>
            Buka Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
