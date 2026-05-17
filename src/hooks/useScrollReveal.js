import { useEffect, useRef } from 'react';

/**
 * Custom hook that attaches an IntersectionObserver to a ref.
 * When the element scrolls into view, it adds 'is-visible' class.
 * Only triggers once per element (unobserves after first intersection).
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <div ref={ref} className="fade-in-section">...</div>
 *
 * @param {object} options - IntersectionObserver options
 * @returns {React.RefObject}
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return ref;
}
