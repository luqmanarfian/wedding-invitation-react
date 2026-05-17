import React from 'react';
import { GIFT } from '../data/content';
import { copyToClipboard } from '../utils/clipboard';
import { useToast } from '../context/ToastContext';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * WeddingGift — Bank account info with copy-to-clipboard functionality.
 */
export default function WeddingGift() {
  const ref = useScrollReveal();
  const { showToast } = useToast();

  const handleCopy = async () => {
    const success = await copyToClipboard(GIFT.accountNumber);
    if (success) {
      showToast('Tersalin!', 'Nomor rekening berhasil disalin.');
    } else {
      showToast('Gagal', 'Gagal menyalin nomor rekening.');
    }
  };

  return (
    <section className="py-24 bg-white px-4">
      <div ref={ref} className="max-w-3xl mx-auto text-center fade-in-section">
        <i className="fas fa-gift text-5xl text-blush-400 mb-6"></i>
        <h2 className="font-serif text-4xl md:text-5xl text-blush-900 mb-6 font-bold">
          Wedding Gift
        </h2>
        <p className="text-text-light mb-10 text-lg">
          Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika Anda hendak
          memberikan tanda kasih, dapat mengirimkan melalui fitur di bawah ini:
        </p>

        <div className="bg-blush-50 rounded-3xl p-8 border border-blush-100 shadow-md relative overflow-hidden">
          {/* Decorative background icon */}
          <div className="absolute -right-10 -top-10 text-blush-100 opacity-50">
            <i className="fas fa-credit-card text-[150px]"></i>
          </div>

          <h3 className="text-xl font-bold text-text-main mb-2 relative z-10">
            {GIFT.bankName}
          </h3>
          <p className="text-3xl font-mono tracking-widest text-blush-800 font-bold mb-2 relative z-10">
            {GIFT.accountNumber}
          </p>
          <p className="text-text-light mb-6 relative z-10">a.n {GIFT.accountHolder}</p>

          <button
            onClick={handleCopy}
            className="relative z-10 bg-white border-2 border-blush-300 text-blush-600 hover:bg-blush-50 font-semibold py-2 px-6 rounded-full transition-colors flex items-center justify-center mx-auto gap-2"
          >
            <i className="far fa-copy"></i>
            Salin No. Rekening
          </button>
        </div>
      </div>
    </section>
  );
}
