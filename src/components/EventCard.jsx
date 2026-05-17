import React from 'react';

/**
 * EventCard — Reusable card for Akad Nikah or Resepsi.
 * Shows icon, title, date, time, venue, and address.
 * Has a decorative corner that scales on hover.
 *
 * @param {object} props
 * @param {string} props.title - "Akad Nikah" or "Resepsi"
 * @param {string} props.icon - Font Awesome icon class
 * @param {string} props.date - Event date text
 * @param {string} props.time - Event time text
 * @param {string} props.venue - Venue name
 * @param {string} props.address - Full address
 * @param {boolean} [props.isFirst] - If true, corner is on the right; else left
 */
export default function EventCard({ title, icon, date, time, venue, address, isFirst = true }) {
  return (
    <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden group">
      {/* Decorative corner blob with hover animation */}
      <div
        className={`absolute top-0 ${
          isFirst ? 'right-0 rounded-bl-full' : 'left-0 rounded-br-full'
        } w-24 h-24 bg-blush-100 -z-10 transition-transform group-hover:scale-150`}
      ></div>

      <i className={`${icon} text-4xl text-blush-400 mb-4`}></i>
      <h3 className="font-serif text-2xl font-bold text-blush-900 mb-2">{title}</h3>
      <p className="font-bold text-lg mb-1">{date}</p>
      <p className="text-blush-800 font-semibold mb-4 bg-blush-100 inline-block px-4 py-1 rounded-full">
        {time}
      </p>
      <div className="mb-6">
        <p className="font-semibold text-text-main">{venue}</p>
        <p className="text-text-light text-sm">{address}</p>
      </div>
    </div>
  );
}
