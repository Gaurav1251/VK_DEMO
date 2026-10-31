import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * Labelled input / textarea with an accessible error message.
 * `as` can also be a component such as ui/Select, which styles itself.
 */
export default function Field({ label, name, required, error, hint, as = 'input', className = '', children, ...props }) {
  const id = `f-${name}`;
  const Tag = as;
  const native = typeof as === 'string';
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
          {required && <span className="ml-0.5 text-accent">*</span>}
        </label>
      )}
      <Tag
        id={id}
        name={native ? name : undefined}
        className={native ? cn('input', as === 'textarea' && 'min-h-[96px] resize-y', error && 'input-error') : undefined}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...props}
      >
        {children}
      </Tag>
      {error ? (
        <p id={`${id}-err`} className="field-error">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line bg-white p-3.5 transition hover:border-brand/30">
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-muted">{description}</span>}
      </span>
      <span className="relative mt-0.5 inline-flex shrink-0">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="h-6 w-11 rounded-full bg-[#CBD5E1] transition peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2" />
        <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
