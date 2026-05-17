import React from 'react';

/**
 * WishCard — Individual wish/greeting card.
 * Shows sender name, optional attendance badge, and message.
 */
export default function WishCard({ name, text, status }) {
  return (
    <div className="bg-white bg-opacity-60 p-4 rounded-xl border border-blush-100">
      <div className="flex justify-between items-start mb-1">
        <span className="font-bold text-sm text-blush-900">{name}</span>
        {status === 'Hadir' && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            <i className="fas fa-check-circle mr-1"></i>Hadir
          </span>
        )}
      </div>
      <p className="text-text-main text-sm whitespace-pre-line">{text}</p>
    </div>
  );
}
