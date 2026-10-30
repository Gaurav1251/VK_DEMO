import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Open overlays, newest last. Only the top one reacts to Escape/Tab.
const stack = [];

/** Escape to close, focus moved in and trapped, focus restored on close, body scroll locked. */
export function useOverlay(open, onClose, panelRef) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return undefined;
    const token = {};
    stack.push(token);
    const previouslyFocused = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const focusFirst = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const target = panel.querySelector('[data-autofocus]') || panel.querySelector(FOCUSABLE) || panel;
      target.focus({ preventScroll: true });
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKey = (e) => {
      if (stack[stack.length - 1] !== token) return;
      if (e.key === 'Escape') {
        closeRef.current?.();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      cancelAnimationFrame(raf);
      stack.splice(stack.indexOf(token), 1);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = stack.length ? 'hidden' : overflow;
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open, panelRef]);
}

const SIZES = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' };

export default function Modal({ open, onClose, title, subtitle, children, footer, size = 'md', icon }) {
  const panelRef = useRef(null);
  const titleId = `modal-${useId().replace(/:/g, '')}`;
  useOverlay(open, onClose, panelRef);
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6">
      <div className="fade-in absolute inset-0 bg-brand-deeper/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'pop-in relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-float outline-none sm:rounded-2xl',
          SIZES[size],
        )}
      >
        <div className="flex items-start gap-3 border-b border-line px-5 py-4 sm:px-6">
          {icon}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-lg font-bold">
              {title}
            </h2>
            {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="-mr-1.5 rounded-lg p-1.5 text-muted hover:bg-soft hover:text-ink" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2.5 border-t border-line bg-soft/60 px-5 py-3.5 sm:px-6">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
