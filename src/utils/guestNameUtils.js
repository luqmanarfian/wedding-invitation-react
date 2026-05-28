/**
 * Guest Name Utility Functions
 *
 * Provides safe handling for guest names throughout the RSVP & check-in flow:
 * - Storage: plain text normalization (no HTML escaping)
 * - Decode: safe decoding of legacy HTML-encoded data from Google Sheets
 * - Render: safe DOM rendering via textContent (never innerHTML)
 *
 * SECURITY PRINCIPLE:
 * - Data storage stores plain text as-is.
 * - HTML escaping is a rendering concern handled by React JSX auto-escape.
 * - Legacy data that was HTML-encoded is decoded safely via DOMParser.
 */

/**
 * Normalizes a guest name for storage.
 * Trims whitespace and enforces maximum length.
 * Does NOT HTML-escape — data is stored as plain text.
 *
 * @param {string} value - Raw input value
 * @param {number} [maxLength=100] - Maximum character length
 * @returns {string} Normalized plain-text name
 */
export function normalizeGuestNameForStorage(value, maxLength = 100) {
  if (value === undefined || value === null) return '';
  const str = String(value).trim();
  if (str.length > maxLength) {
    return str.substring(0, maxLength);
  }
  return str;
}

/**
 * Decodes a stored guest name that may contain HTML entities (legacy data).
 * Uses the browser's DOMParser for safe decoding — no innerHTML.
 *
 * After the Apps Script fix, new data will be stored as plain text and
 * this function will be a no-op passthrough. It exists for backward
 * compatibility with data that was HTML-escaped before the fix.
 *
 * @param {string} value - Potentially HTML-encoded name from storage
 * @returns {string} Decoded plain-text name
 */
export function decodeStoredGuestName(value) {
  if (!value || typeof value !== 'string') return value || '';

  // Quick check: if no HTML entities are present, return as-is
  if (!/&\w+;|&#\w+;/.test(value)) return value;

  try {
    const doc = new DOMParser().parseFromString(value, 'text/html');
    return doc.body.textContent || value;
  } catch {
    return value;
  }
}

/**
 * Safely renders a guest name into a DOM element as plain text.
 * Uses textContent — never innerHTML.
 *
 * NOTE: In React components, prefer JSX text interpolation ({value})
 * which auto-escapes. This function is for imperative DOM manipulation
 * outside of React's render cycle.
 *
 * @param {HTMLElement} element - Target DOM element
 * @param {string} value - Guest name to render
 */
export function renderGuestNameSafely(element, value) {
  if (!element) return;
  element.textContent = value || '';
}
