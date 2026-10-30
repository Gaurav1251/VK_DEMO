import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const STYLES = {
  success: { icon: CheckCircle2, tone: 'text-emerald-600' },
  error: { icon: AlertTriangle, tone: 'text-red-600' },
  info: { icon: Info, tone: 'text-brand' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const counter = useRef(0);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback(
    (message, type = 'success') => {
      counter.current += 1;
      const id = counter.current;
      // One toast at a time: a new message replaces the previous one instead of stacking.
      setToasts([{ id, message, type }]);
      setTimeout(() => dismiss(id), type === 'error' ? 5000 : 2800);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-3 bottom-24 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:items-start"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const { icon: Icon, tone } = STYLES[t.type] || STYLES.info;
          return (
            <div
              key={t.id}
              className="toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink shadow-float"
            >
              <Icon className={`mt-0.5 h-[18px] w-[18px] shrink-0 ${tone}`} aria-hidden="true" />
              <span className="flex-1 leading-snug">{t.message}</span>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                className="-mr-1 rounded p-0.5 text-muted hover:text-ink"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx.toast;
}
