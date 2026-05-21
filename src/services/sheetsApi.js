import { GOOGLE_SHEETS_CONFIG } from '../data/content';

/**
 * Google Sheets API Service
 *
 * Mengirim data RSVP dan Ucapan ke Google Sheets via Google Apps Script Web App.
 *
 * ARSITEKTUR:
 * - POST dikirim dengan Content-Type: 'text/plain' (simple request, tidak trigger CORS preflight).
 * - Menggunakan mode: 'cors' (bukan 'no-cors') agar browser bisa MEMBACA response body.
 * - Response body dibaca dan divalidasi → QR hanya ditampilkan jika result === 'success'.
 *
 * SYARAT DI APPS SCRIPT:
 * - Script harus di-deploy sebagai: "Execute as: Me, Who has access: Anyone"
 *
 * === SETUP GUIDE ===
 * 1. Buka Google Sheets baru
 * 2. Extensions > Apps Script
 * 3. Paste kode dari .agents/sheet/code.js
 * 4. Deploy > New Deployment > Web App > Execute as Me > Anyone can access
 * 5. Salin URL deployment, paste ke GOOGLE_SHEETS_CONFIG.webAppUrl di content.js
 * 6. Set GOOGLE_SHEETS_CONFIG.enabled = true
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
 * Kirim data RSVP ke Google Sheets dan validasi response-nya.
 *
 * Karena menggunakan mode: 'cors' dengan Content-Type: 'text/plain' (simple request),
 * browser dapat membaca response body dari Google Apps Script.
 * QR Code hanya ditampilkan jika Apps Script benar-benar mengembalikan result: 'success'.
 *
 * @param {{ name: string, count: string, status: string }} data
 * @returns {Promise<{ result: 'success' | 'local' | 'error', qrCodeId?: string | null, message?: string }>}
 */
export async function submitRSVPToSheet(data) {
  // Validasi input dasar sebelum request
  if (!data.name || !data.name.trim()) {
    return { result: 'error', message: 'Nama tidak boleh kosong.' };
  }

  const qrCodeId = data.status === 'Hadir' ? generateQRCodeId() : null;

  // Mode lokal jika Google Sheets dinonaktifkan
  if (!GOOGLE_SHEETS_CONFIG.enabled || !GOOGLE_SHEETS_CONFIG.webAppUrl) {
    console.log('[Sheets] Disabled — RSVP disimpan lokal saja:', data);
    return { result: 'local', qrCodeId };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        type: 'rsvp',
        origin: window.location.origin,
        ...data,
        qrCodeId,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error('[Sheets] HTTP error dari Apps Script:', response.status);
      return {
        result: 'error',
        qrCodeId: null,
        message: `Server mengembalikan error (HTTP ${response.status}). Silakan coba lagi.`,
      };
    }

    // Baca dan validasi response body dari Apps Script
    const result = await response.json();

    if (result.result !== 'success') {
      console.error('[Sheets] Apps Script error:', result.message || result.error);
      return {
        result: 'error',
        qrCodeId: null,
        message: result.message || 'Data gagal tersimpan di server. Silakan coba lagi.',
      };
    }

    // Gunakan qrCodeId dari server jika ada, fallback ke yang di-generate frontend
    return {
      result: 'success',
      qrCodeId: result.qrCodeId || qrCodeId,
    };

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('[Sheets] RSVP request timeout (15s)');
      return {
        result: 'error',
        qrCodeId: null,
        message: 'Koneksi timeout. Silakan periksa internet Anda dan coba lagi.',
      };
    }

    console.error('[Sheets] Gagal kirim RSVP — network error:', error);
    return {
      result: 'error',
      qrCodeId: null,
      message: 'Gagal terhubung ke server. Periksa koneksi internet Anda.',
    };
  }
}

/**
 * Kirim data Ucapan ke Google Sheets.
 * @param {{ name: string, text: string }} data
 * @returns {Promise<{ result: 'success' | 'local' | 'error', message?: string }>}
 */
export async function submitWishToSheet(data) {
  if (!GOOGLE_SHEETS_CONFIG.enabled || !GOOGLE_SHEETS_CONFIG.webAppUrl) {
    console.log('[Sheets] Disabled — Ucapan disimpan lokal saja:', data);
    return { result: 'local' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        type: 'wish',
        origin: window.location.origin,
        ...data,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return { result: 'error', message: `Server error (HTTP ${response.status}).` };
    }

    const result = await response.json();

    if (result.result !== 'success') {
      return { result: 'error', message: result.message || 'Gagal menyimpan ucapan.' };
    }

    return { result: 'success' };

  } catch (error) {
    if (error.name === 'AbortError') {
      return { result: 'error', message: 'Koneksi timeout. Silakan coba lagi.' };
    }
    console.error('[Sheets] Gagal kirim Ucapan:', error);
    return { result: 'error', message: 'Gagal mengirim ucapan. Periksa koneksi internet.' };
  }
}

/**
 * Ambil daftar ucapan dari Google Sheets.
 * @returns {Promise<{ result: string, wishes?: Array<{ name: string, text: string }> }>}
 */
export async function fetchWishesFromSheet() {
  if (!GOOGLE_SHEETS_CONFIG.enabled || !GOOGLE_SHEETS_CONFIG.webAppUrl) {
    return { result: 'disabled', wishes: [] };
  }

  try {
    const url = `${GOOGLE_SHEETS_CONFIG.webAppUrl}?type=wishes&origin=${encodeURIComponent(window.location.origin)}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error('[Sheets] HTTP error saat fetch ucapan:', response.status);
      return { result: 'error', wishes: [] };
    }

    const data = await response.json();

    if (data.result === 'success' && Array.isArray(data.wishes)) {
      return { result: 'success', wishes: data.wishes };
    }

    return { result: 'error', wishes: [] };
  } catch (error) {
    console.error('[Sheets] Gagal ambil ucapan:', error); // NOSONAR
    return { result: 'error', wishes: [] };
  }
}
