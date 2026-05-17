import React, { useState } from 'react';
import RSVPForm from './RSVPForm';
import WishForm from './WishForm';
import WishCard from './WishCard';
import { DEFAULT_WISHES } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * RSVP — Wrapper section containing RSVP form and guest book (wishes).
 * Manages the wishes list state locally.
 */
export default function RSVP({ guestName }) {
  const ref = useScrollReveal();
  const [wishes, setWishes] = useState(DEFAULT_WISHES);
  const [rsvpStatus] = useState('Hadir');

  const handleNewWish = (wish) => {
    setWishes((prev) => [wish, ...prev]);
  };

  return (
    <section className="py-24 bg-blush-100 px-4 relative">
      <div ref={ref} className="max-w-4xl mx-auto fade-in-section">
        <div className="text-center mb-10">
          <h2 className="font-serif text-4xl md:text-5xl text-blush-900 mb-4 font-bold">
            RSVP &amp; Ucapan
          </h2>
          <p className="text-lg text-text-main font-medium italic">
            &quot;Setiap doa dan harapan dari kalian akan menjadi bagian dari cerita kami💖&quot;
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* RSVP Form */}
          <RSVPForm guestName={guestName} />

          {/* Guest Book */}
          <div className="md:col-span-3 glass-card p-6 md:p-8 rounded-2xl flex flex-col">
            <h3 className="font-bold text-xl mb-4 border-b border-blush-200 pb-2">
              Kirim Ucapan
            </h3>

            <WishForm
              guestName={guestName}
              rsvpStatus={rsvpStatus}
              onNewWish={handleNewWish}
            />

            {/* Scrollable wishes list */}
            <div className="flex-1 max-h-[300px] overflow-y-auto pr-2 space-y-4 custom-scrollbar">
              {wishes.map((wish) => (
                <WishCard key={wish.id} {...wish} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
