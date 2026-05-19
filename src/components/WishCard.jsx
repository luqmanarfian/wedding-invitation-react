import React from 'react';

/**
 * WishCard — Individual wish/greeting card.
 * Shows sender name and message.
 */
export default function WishCard({ name, text }) {
  return (
    <div className="bg-white bg-opacity-60 p-4 rounded-xl border border-blush-100">
      <div className="mb-1">
        <span className="font-bold text-sm text-blush-900">{name}</span>
      </div>
      <p className="text-text-main text-sm whitespace-pre-line">{text}</p>
    </div>
  );
}
