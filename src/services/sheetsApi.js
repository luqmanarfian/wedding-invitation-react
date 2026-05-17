import { GOOGLE_SHEETS_CONFIG } from '../data/content';

/**
 * Google Sheets API Service
 *
 * Mengirim data RSVP dan Ucapan ke Google Sheets via Google Apps Script Web App.
 *
 * === SETUP GUIDE ===
 * 1. Buka Google Sheets, buat spreadsheet baru
 * 2. Buat 2 sheet: "RSVP" dan "Ucapan"
 *    - Sheet RSVP: kolom A=Timestamp, B=Nama, C=Jumlah, D=Status
 *    - Sheet Ucapan: kolom A=Timestamp, B=Nama, C=Ucapan, D=Status
 * 3. Buka Extensions > Apps Script
 * 4. Paste kode berikut:
 *
 * ```javascript
 * function doPost(e) {
 *   var lock = LockService.getScriptLock();
 *   lock.tryLock(10000);
 *
 *   try {
 *     var ss = SpreadsheetApp.getActiveSpreadsheet();
 *     var data = JSON.parse(e.postData.contents);
 *
 *     var sheetName = data.type === 'rsvp' ? 'RSVP' : 'Ucapan';
 *     var sheet = ss.getSheetByName(sheetName);
 *
 *     if (data.type === 'rsvp') {
 *       sheet.appendRow([new Date(), data.name, data.count, data.status]);
 *     } else {
 *       sheet.appendRow([new Date(), data.name, data.text, data.status]);
 *     }
 *
 *     return ContentService.createTextOutput(
 *       JSON.stringify({ result: 'success' })
 *     ).setMimeType(ContentService.MimeType.JSON);
 *   } catch (err) {
 *     return ContentService.createTextOutput(
 *       JSON.stringify({ result: 'error', error: err.toString() })
 *     ).setMimeType(ContentService.MimeType.JSON);
 *   } finally {
 *     lock.releaseLock();
 *   }
 * }
 * ```
 *
 * 5. Deploy > New Deployment > Web App > Execute as Me > Anyone can access
 * 6. Copy URL, paste ke GOOGLE_SHEETS_CONFIG.webAppUrl di src/data/content.js
 * 7. Set GOOGLE_SHEETS_CONFIG.enabled = true
 */

/**
 * Kirim data RSVP ke Google Sheets
 * @param {{ name: string, count: string, status: string }} data
 */
export async function submitRSVPToSheet(data) {
  if (!GOOGLE_SHEETS_CONFIG.enabled || !GOOGLE_SHEETS_CONFIG.webAppUrl) {
    console.log('[Sheets] Disabled — RSVP disimpan lokal saja:', data);
    return { result: 'local' };
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script requires no-cors
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'rsvp', ...data }),
    });

    return { result: 'success' };
  } catch (error) {
    console.error('[Sheets] Gagal kirim RSVP:', error);
    return { result: 'error', error };
  }
}

/**
 * Kirim data Ucapan ke Google Sheets
 * @param {{ name: string, text: string, status: string }} data
 */
export async function submitWishToSheet(data) {
  if (!GOOGLE_SHEETS_CONFIG.enabled || !GOOGLE_SHEETS_CONFIG.webAppUrl) {
    console.log('[Sheets] Disabled — Ucapan disimpan lokal saja:', data);
    return { result: 'local' };
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_CONFIG.webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'wish', ...data }),
    });

    return { result: 'success' };
  } catch (error) {
    console.error('[Sheets] Gagal kirim Ucapan:', error);
    return { result: 'error', error };
  }
}
