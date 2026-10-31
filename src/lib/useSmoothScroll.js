import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

/**
 * Smooth, eased page scrolling for mouse wheels and trackpads (touch keeps the phone's native scrolling).
 * Modals, menus and dropdown lists scroll normally, and the page stays still while a modal is open.
 * Skipped for reduced-motion users. Returns a ref to the Lenis instance (null when not running).
 */
export default function useSmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      wheelMultiplier: 1,
      anchors: { offset: -90 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      // Anything floating above the page scrolls on its own
      prevent: (node) => Boolean(node.closest?.('[role=dialog], [role=listbox], [data-lenis-prevent]')),
    });
    lenisRef.current = lenis;

    // Modals lock the page with body overflow:hidden — pause smoothing so the page behind can't drift
    const syncLock = () => (document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start());
    const mo = new MutationObserver(syncLock);
    mo.observe(document.body, { attributes: true, attributeFilter: ['style'] });

    return () => {
      mo.disconnect();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
