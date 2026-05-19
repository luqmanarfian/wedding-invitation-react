import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { submitWishToSheet } from '../services/sheetsApi';

/**
 * WishForm — Form to submit greetings/wishes.
 * Adds new wishes to the parent list and sends to Google Sheets.
 */
export default function WishForm({ guestName, onNewWish }) {
  const { showToast } = useToast();
  const [name, setName] = useState(guestName);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);

    // Send to Google Sheets
    await submitWishToSheet({ name, text });

    // Add to local wish list (prepend to top)
    onNewWish({
      id: Date.now(),
      name,
      text,
    });

    showToast('Berhasil', 'Ucapan Anda berhasil ditambahkan.');
    setText('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama Anda"
        required
        className="w-full px-4 py-2 rounded-t-lg border border-blush-200 focus:outline-none focus:ring-2 focus:ring-blush-400 bg-white bg-opacity-80 mb-[-1px] relative z-10"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="3"
        placeholder="Tuliskan doa & ucapan..."
        required
        className="w-full px-4 py-2 rounded-b-lg border border-blush-200 focus:outline-none focus:ring-2 focus:ring-blush-400 bg-white bg-opacity-80 resize-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-blush-400 hover:bg-blush-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors float-right disabled:opacity-50"
      >
        {loading ? 'Mengirim...' : 'Kirim'}
      </button>
      <div className="clear-both"></div>
    </form>
  );
}
