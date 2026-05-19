import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../context/ToastContext';
import { submitRSVPToSheet } from '../services/sheetsApi';

/**
 * RSVPForm — Konfirmasi kehadiran form.
 * Sends data to Google Sheets (if configured), shows toast notification,
 * and triggers parent handler to display the QR Code modal for attending guests.
 */
export default function RsvpForm({ guestName, onRSVPSuccess }) {
  const { showToast } = useToast();
  const [name, setName] = useState(guestName);
  const [count, setCount] = useState('1');
  const [status, setStatus] = useState('Hadir');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Send to Google Sheets (or log locally if not configured)
    const result = await submitRSVPToSheet({ name, count, status });

    if (status === 'Hadir' && result.qrCodeId) {
      // Trigger parent handler to show QR Code modal
      if (onRSVPSuccess) {
        onRSVPSuccess({
          qrCodeId: result.qrCodeId,
          guestName: name,
          guestCount: count
        });
      }
      showToast('RSVP Berhasil!', 'QR Code tiket masuk Anda telah dibuat.');
    } else {
      showToast('Terima Kasih!', 'Konfirmasi kehadiran Anda telah dikirim.');
    }

    setLoading(false);

    // Reset form but keep guest name
    setCount('1');
    setStatus('Hadir');
  };

  return (
    <div className="md:col-span-2 glass-card p-6 md:p-8 rounded-2xl h-fit">
      <h3 className="font-bold text-xl mb-4 border-b border-blush-200 pb-2">
        Konfirmasi Kehadiran
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-main mb-1">Nama Lengkap</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-blush-200 focus:outline-none focus:ring-2 focus:ring-blush-400 bg-white bg-opacity-80"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-main mb-1">Jumlah Kehadiran</label>
          <select
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-blush-200 focus:outline-none focus:ring-2 focus:ring-blush-400 bg-white bg-opacity-80"
          >
            <option value="1">1 Orang</option>
            <option value="2">2 Orang</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-text-main mb-1">Konfirmasi</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-blush-200 focus:outline-none focus:ring-2 focus:ring-blush-400 bg-white bg-opacity-80"
          >
            <option value="Hadir">Ya, Saya akan hadir</option>
            <option value="Tidak Hadir">Maaf, saya tidak bisa hadir</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blush-500 hover:bg-blush-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Mengirim...' : 'Kirim RSVP'}
        </button>
      </form>
    </div>
  );
}

RsvpForm.propTypes = {
  guestName: PropTypes.string,
  onRSVPSuccess: PropTypes.func
};
