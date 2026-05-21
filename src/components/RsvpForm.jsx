import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useToast } from '../context/ToastContext';
import { submitRSVPToSheet } from '../services/sheetsApi';

/**
 * RSVPForm — Konfirmasi kehadiran form.
 *
 * FLOW:
 * 1. User submit form.
 * 2. Data dikirim ke Google Sheets via API.
 * 3. Jika API error (network error/timeout), tampilkan pesan error yang jelas.
 *    QR Code TIDAK ditampilkan.
 * 4. Jika API berhasil (request terkirim tanpa network error):
 *    - Jika status Hadir: tampilkan QR Code modal.
 *    - Jika status Tidak Hadir: tampilkan pesan terima kasih.
 */
export default function RsvpForm({ guestName, onRSVPSuccess }) {
  const { showToast } = useToast();
  const [name, setName] = useState(guestName);
  const [count, setCount] = useState('1');
  const [status, setStatus] = useState('Hadir');
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hindari double-submit saat loading
    if (loading) return;

    setLoading(true);
    setSubmitError(null);

    const result = await submitRSVPToSheet({ name: name.trim(), count, status });

    setLoading(false);

    // Jika API gagal (network error atau timeout), JANGAN tampilkan success/QR.
    if (result.result === 'error') {
      const errMsg = result.message || 'Terjadi kesalahan. Silakan coba lagi.';
      setSubmitError(errMsg);
      showToast('Gagal Mengirim RSVP', errMsg, 'error');
      return;
    }

    // Berhasil terkirim ke server — reset form
    setCount('1');
    setStatus('Hadir');
    setSubmitError(null);

    if (status === 'Hadir' && result.qrCodeId) {
      // Trigger parent untuk tampilkan QR Code modal
      if (onRSVPSuccess) {
        onRSVPSuccess({
          qrCodeId: result.qrCodeId,
          guestName: name.trim(),
          guestCount: count,
        });
      }
      showToast('RSVP Berhasil! 🎉', 'QR Code tiket masuk Anda telah dibuat. Harap simpan atau screenshot.');
    } else {
      showToast('Terima Kasih!', 'Konfirmasi ketidakhadiran Anda telah dikirim.');
    }
  };

  return (
    <div className="md:col-span-2 glass-card p-6 md:p-8 rounded-2xl h-fit">
      <h3 className="font-bold text-xl mb-4 border-b border-blush-200 pb-2">
        Konfirmasi Kehadiran
      </h3>

      {/* Error Banner — tampil jika API gagal */}
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-sm text-red-700" role="alert">
          <i className="fas fa-exclamation-circle mt-0.5 flex-shrink-0"></i>
          <div>
            <p className="font-semibold">RSVP Gagal Dikirim</p>
            <p className="mt-0.5">{submitError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-main mb-1">Nama Lengkap</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg border border-blush-200 focus:outline-none focus:ring-2 focus:ring-blush-400 bg-white bg-opacity-80 disabled:opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-main mb-1">Jumlah Kehadiran</label>
          <select
            value={count}
            onChange={(e) => setCount(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg border border-blush-200 focus:outline-none focus:ring-2 focus:ring-blush-400 bg-white bg-opacity-80 disabled:opacity-50"
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
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg border border-blush-200 focus:outline-none focus:ring-2 focus:ring-blush-400 bg-white bg-opacity-80 disabled:opacity-50"
          >
            <option value="Hadir">Ya, Saya akan hadir</option>
            <option value="Tidak Hadir">Maaf, saya tidak bisa hadir</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blush-500 hover:bg-blush-600 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              <span>Mengirim...</span>
            </>
          ) : submitError ? (
            'Coba Lagi'
          ) : (
            'Kirim RSVP'
          )}
        </button>
      </form>
    </div>
  );
}

RsvpForm.propTypes = {
  guestName: PropTypes.string,
  onRSVPSuccess: PropTypes.func,
};
