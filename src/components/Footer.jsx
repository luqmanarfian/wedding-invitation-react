import React from 'react';

/**
 * Footer — Copyright and closing message.
 */
export default function Footer() {
  return (
    <footer className="bg-blush-900 text-blush-100 py-12 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="relative z-10">
        <h2 className="font-serif text-3xl mb-4 font-bold">Lancy &amp; Kiyora</h2>
        <p className="text-sm opacity-80 mb-8">
          Terima kasih atas doa dan restu yang telah diberikan.
        </p>
        <p className="text-xs opacity-60">
          Created with ❤️ for the lovely couple.
          <br />
          &copy; 2026 Digital Wedding Invitation
        </p>
      </div>
    </footer>
  );
}
