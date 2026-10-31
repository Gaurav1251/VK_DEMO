import { useEffect } from 'react';

/**
 * Animates every `[data-reveal]` element in as it scrolls into view (once).
 * Variants via the attribute value: "" / "up" (default), "left", "right", "zoom", "fade".
 * Elements that enter together are staggered, so a row of cards ripples in.
 * Watches the DOM, so content rendered later (route changes, filters) is picked up too.
 * Skipped entirely for reduced-motion users and browsers without IntersectionObserver.
 */
export default function useScrollReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const html = document.documentElement;
    html.classList.add('reveal-on');

    const io = new IntersectionObserver(
      (entries) => {
        let n = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.style.setProperty('--reveal-delay', `${Math.min(n++, 5) * 90}ms`);
          // A data attribute, not a class, so React re-renders never wipe it
          el.setAttribute('data-revealed', '');
          io.unobserve(el);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    );

    const scan = () => document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => io.observe(el));
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    scan();
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
      html.classList.remove('reveal-on');
    };
  }, []);
}
