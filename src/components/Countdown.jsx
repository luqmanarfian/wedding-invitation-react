import React from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { WEDDING_DATE } from '../data/content';

/**
 * Countdown — Real-time countdown timer to the wedding date.
 * Uses the useCountdown hook which handles setInterval and cleanup.
 *
 * @param {object} props
 * @param {string} [props.targetDate] - Override target date (defaults to WEDDING_DATE)
 */
export default function Countdown({ targetDate = WEDDING_DATE }) {
  const { days, hours, minutes, seconds } = useCountdown(targetDate);

  const units = [
    { value: days, label: 'Hari' },
    { value: hours, label: 'Jam' },
    { value: minutes, label: 'Menit' },
    { value: seconds, label: 'Detik' },
  ];

  return (
    <div className="flex justify-center gap-4 md:gap-8 mb-16">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="bg-blush-50 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex flex-col items-center justify-center shadow-md border border-blush-200"
        >
          <span className="text-2xl md:text-3xl font-bold text-blush-800">
            {unit.value}
          </span>
          <span className="text-xs md:text-sm text-text-light uppercase tracking-wide">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
