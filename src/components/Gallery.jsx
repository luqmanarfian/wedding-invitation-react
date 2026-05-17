import React, { useState } from 'react';
import Lightbox from './Lightbox';
import { GALLERY_IMAGES } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * Gallery — Photo gallery grid with lightbox support.
 */
export default function Gallery() {
  const ref = useScrollReveal();
  const [lightboxSrc, setLightboxSrc] = useState(null);

  return (
    <section className="py-24 bg-blush-50 px-4">
      <div ref={ref} className="max-w-6xl mx-auto fade-in-section">
        <h2 className="font-serif text-4xl md:text-5xl text-blush-900 mb-12 font-bold text-center">
          Galeri Momen
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY_IMAGES.map((img, index) => (
            <div
              key={index}
              className={`overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 ${
                img.wide ? 'md:col-span-2' : ''
              }`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-48 md:h-64 object-cover hover:scale-110 transition-transform duration-500 cursor-pointer"
                loading="lazy"
                onClick={() => setLightboxSrc(img.src)}
              />
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        src={lightboxSrc}
        isOpen={!!lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />
    </section>
  );
}
