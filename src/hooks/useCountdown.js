import { useState, useEffect } from 'react';

/**
 * Custom hook for countdown timer.
 * Calculates remaining days, hours, minutes, and seconds until targetDate.
 *
 * @param {string} targetDate - ISO date string (e.g., "2026-06-12T11:30:00")
 * @returns {{ days: string, hours: string, minutes: string, seconds: string }}
 */
export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    // Update every second; clears interval on unmount to prevent memory leaks
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
}

/**
 * Calculates the difference between now and target date.
 * Returns zero-padded string values for direct rendering.
 */
function calculateTimeLeft(targetDate) {
  const distance = new Date(targetDate).getTime() - Date.now();

  if (distance <= 0) {
    return { days: '00', hours: '00', minutes: '00', seconds: '00' };
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  };
}
