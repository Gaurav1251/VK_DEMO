import { useEffect, useRef, useState } from 'react';

/**
 * Counts from `from` to `to` once the number scrolls into view.
 * Screen readers always get the final value; the animated digits are visual only.
 */
export default function CountUp({ to, from = 0, prefix = '', suffix = '', duration = 2200, delay = 250, separator = false }) {
  const ref = useRef(null);
  const [value, setValue] = useState(from);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      setValue(to);
      return undefined;
    }

    let raf;
    const run = () => {
      const start = performance.now() + delay;
      const tick = (now) => {
        const t = Math.max(0, Math.min(1, (now - start) / duration));
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        setValue(Math.round(from + (to - from) * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, from, duration, delay]);

  const shown = separator ? value.toLocaleString('en-IN') : String(value);
  return (
    <span ref={ref}>
      <span className="sr-only">
        {prefix}
        {separator ? to.toLocaleString('en-IN') : to}
        {suffix}
      </span>
      <span aria-hidden="true" className="tabular-nums">
        {prefix}
        {shown}
        {suffix}
      </span>
    </span>
  );
}
