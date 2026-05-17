import React from 'react';
import { OUR_STORY } from '../data/content';
import { useScrollReveal } from '../hooks/useScrollReveal';

/**
 * WaveDivider — SVG wave shape used as section transition.
 * @param {object} props
 * @param {string} props.fill - Fill color for the wave
 * @param {boolean} props.flip - If true, rotates the wave 180°
 */
function WaveDivider({ fill = '#ffffff', flip = false }) {
  return (
    <div className={`absolute ${flip ? 'top-0 rotate-180' : 'bottom-0'} left-0 w-full overflow-hidden leading-none`}>
      <svg
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="relative block w-full h-12"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}

/**
 * OurStory — Love story section with a timeline-style glassmorphism card.
 */
export default function OurStory() {
  const ref = useScrollReveal();

  return (
    <section className="py-24 bg-blush-100 px-4 relative">
      <WaveDivider fill="#ffffff" flip />

      <div ref={ref} className="max-w-4xl mx-auto text-center fade-in-section relative z-10">
        <h2 className="font-serif text-4xl md:text-5xl text-blush-900 mb-12 font-bold">
          Cerita Kami
        </h2>

        <div className="glass-card p-8 md:p-12 rounded-3xl text-left border-l-4 border-l-blush-400 shadow-xl relative">
          <i className="fas fa-heart absolute -left-[18px] top-10 text-blush-500 bg-blush-100 p-1 rounded-full text-2xl"></i>

          <div className="mb-6">
            {OUR_STORY.paragraphs.map((para, i) => (
              <p key={i} className="text-lg leading-relaxed text-text-main mb-4">
                {para}
              </p>
            ))}

            <blockquote className="font-serif text-2xl text-blush-800 italic border-l-4 border-blush-300 pl-4 py-2 my-6 bg-blush-50 rounded-r-lg">
              {OUR_STORY.quote}
            </blockquote>

            <p className="text-lg leading-relaxed text-text-main">{OUR_STORY.closing}</p>
          </div>
        </div>
      </div>

      <WaveDivider fill="#ffffff" />
    </section>
  );
}
