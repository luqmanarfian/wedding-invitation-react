import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

/**
 * QRCodeModal — Modal popup displaying a QR Code ticket after successful RSVP.
 * The QR Code contains a unique ID that can be scanned at the wedding venue entrance.
 *
 * @param {{ isOpen: boolean, onClose: function, qrCodeId: string, guestName: string, guestCount: string }} props
 */
export default function QRCodeModal({ isOpen, onClose, qrCodeId, guestName, guestCount }) {
  const qrRef = useRef(null);

  if (!isOpen || !qrCodeId) return null;

  /**
   * Download QR Code as PNG image.
   * Converts SVG to canvas, then triggers download.
   */
  const handleDownload = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const link = document.createElement('a');
      link.download = `tiket-${guestName.replace(/\s+/g, '-')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full text-center relative animate-fade-in shadow-2xl border border-blush-100">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Tutup"
        >
          <i className="fas fa-times text-xl"></i>
        </button>

        {/* Success icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-check-circle text-green-500 text-3xl"></i>
        </div>

        <h3 className="font-serif text-2xl text-blush-900 font-bold mb-2">
          RSVP Berhasil!
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Terima kasih, <strong>{guestName}</strong>! Silakan simpan atau screenshot QR Code di bawah ini sebagai tiket masuk acara.
        </p>

        {/* QR Code */}
        <div ref={qrRef} className="bg-white p-4 rounded-xl inline-block mb-4 shadow-md">
          <QRCodeSVG
            value={qrCodeId}
            size={180}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#831843"
          />
        </div>

        {/* Guest info */}
        <div className="bg-blush-50 rounded-lg p-3 mb-4 text-sm">
          <p className="text-text-main">
            <i className="fas fa-user mr-2 text-blush-400"></i>
            <strong>{guestName}</strong> ({guestCount} orang)
          </p>
          <p className="text-text-light text-xs mt-1 font-mono break-all">
            ID: {qrCodeId}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-blush-500 hover:bg-blush-600 text-white font-bold py-3 rounded-lg transition-colors text-sm"
          >
            <i className="fas fa-download mr-2"></i>Simpan QR
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-blush-300 text-blush-700 font-bold py-3 rounded-lg hover:bg-blush-50 transition-colors text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
