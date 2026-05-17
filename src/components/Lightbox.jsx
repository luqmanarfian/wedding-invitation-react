import React from 'react';

/**
 * Lightbox — Full-screen image viewer modal.
 * Uses portal-like behavior (fixed positioning over entire viewport).
 * Clicking anywhere closes the lightbox.
 *
 * @param {object} props
 * @param {string} props.src - Image source URL
 * @param {boolean} props.isOpen - Whether lightbox is visible
 * @param {function} props.onClose - Callback to close the lightbox
 */
export default function Lightbox({ src, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center cursor-pointer transition-opacity duration-300"
      onClick={onClose}
    >
      <span className="absolute top-5 right-5 text-white text-4xl cursor-pointer hover:text-blush-300">
        &times;
      </span>
      <img
        src={src}
        alt="Gallery preview"
        className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
      />
    </div>
  );
}
