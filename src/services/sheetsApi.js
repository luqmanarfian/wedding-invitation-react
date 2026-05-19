import { GOOGLE_SHEETS_CONFIG } from '../data/content';

/**
 * Google Sheets API Service
 *
 * Mengirim data RSVP dan Ucapan ke Google Sheets via Google Apps Script Web App.
 * QR Code ID di-generate di frontend untuk menghindari masalah CORS (mode: 'no-cors').
 *
 * === SETUP GUIDE ===
 * 1. Buka Google Sheets, buat spreadsheet baru
 * 2. Buat 2 sheet: "RSVP" dan "Ucapan"
 *    - Sheet RSVP: kolom A=Timestamp, B=Nama, C=Jumlah, D=Status, E=QR_Code_ID, F=Checked_In
 *    - Sheet Ucapan: kolom A=Timestamp, B=Nama, C=Ucapan
 * 3. Buka Extensions > Apps Script
 * 4. Paste kode Google Apps Script (lihat prompt-to-save-data.md)
 * 5. Deploy > New Deployment > Web App > Execute as Me > Anyone can access
 * 6. Copy URL, paste ke GOOGLE_SHEETS_CONFIG.webAppUrl di src/data/content.js
 * 7. Set GOOGLE_SHEETS_CONFIG.enabled = true
 */

/**
 * Generate unique QR Code ID for RSVP check-in.
 * Format: WEDDING-<timestamp>-<random4digit>
 * @returns {string} Unique QR Code identifier
 */
export function generateQRCodeId() {
  const timestamp = Date.now();
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const random = 1000 + (array[0] % 9000);
  return `WEDDING-${timestamp}-${random}`;
}

/**
 * Kirim data RSVP ke Google Sheets.
 * Jika status "Hadir", generate QR Code ID dan sertakan dalam payload.
 * @param {{ name: string, count: string, status: string }} data
 * @returns {Promise<{ result: string, qrCodeId?: string }>}
 */
export async function submitRSVPToSheet(data) {
  const qrCodeId = data.status === 'Hadir' ? generateQRCodeId() : null;

  if (!GOOGLE_SHEETS_CONFIG.enabled || !GOOGLE_SHEETS_CONFIG.webAppUrl) {
    console.log('[Sheets] Disabled — RSVP disimpan lokal saja:', data);
    return { result: 'local', qrCodeId };
  }

  try {
    await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requires no-cors
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ type: 'rsvp', ...data, qrCodeId }),
    });

    return { result: 'success', qrCodeId };
  } catch (error) {
    console.error('[Sheets] Gagal kirim RSVP:', error);
    return { result: 'error', error, qrCodeId };
  }
}

/**
 * Kirim data Ucapan ke Google Sheets.
 * @param {{ name: string, text: string }} data
 * @returns {Promise<{ result: string }>}
 */
export async function submitWishToSheet(data) {
  if (!GOOGLE_SHEETS_CONFIG.enabled || !GOOGLE_SHEETS_CONFIG.webAppUrl) {
    console.log('[Sheets] Disabled — Ucapan disimpan lokal saja:', data);
    return { result: 'local' };
  }

  try {
    await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ type: 'wish', ...data }),
    });

    return { result: 'success' };
  } catch (error) {
    console.error('[Sheets] Gagal kirim Ucapan:', error);
    return { result: 'error', error };
  }
}
