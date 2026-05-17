import { useMemo } from 'react';

/**
 * Custom hook to parse guest name from URL query parameter.
 * Reads the `?to=` parameter and decodes it.
 *
 * Example: ?to=Budi+Santoso → "Budi Santoso"
 *
 * @returns {string} Guest name, or 'Tamu Undangan' if not present
 */
export function useGuestName() {
  const guestName = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    return to ? to.replace(/\+/g, ' ') : 'Tamu Undangan';
  }, []);

  return guestName;
}
