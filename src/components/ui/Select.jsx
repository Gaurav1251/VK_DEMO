import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

const HEIGHTS = { sm: 'h-9 text-[13px]', md: 'h-11 text-sm', lg: 'h-12 text-sm' };

function Lead({ option }) {
  if (option?.thumb) return <span className="shrink-0" aria-hidden="true">{option.thumb}</span>;
  if (option?.dot) return <span className={cn('h-2 w-2 shrink-0 rounded-full', option.dot)} aria-hidden="true" />;
  return null;
}

/**
 * Animated dropdown used across the site and admin instead of the browser's native <select>.
 * `options`: [{ value, label, count?, thumb? (node), dot? (bg class) }]. `onChange` receives the value.
 * The list floats above everything (so modals and tables never clip it), flips upward near the bottom
 * of the screen, and gets a search box once there are more than 7 options.
 * Keyboard: ↑ ↓ to move, Enter to pick, Esc to close (only the list — not a surrounding modal).
 * `variant="pill"` renders a compact trigger styled by `triggerClassName` (e.g. status pills).
 */
export default function Select({
  options,
  value,
  onChange,
  id,
  placeholder = 'Select…',
  caption,
  size = 'md',
  variant = 'field',
  triggerClassName,
  panelMinWidth = 220,
  align = 'left',
  searchable,
  searchPlaceholder = 'Search…',
  listLabel = 'Options',
  'aria-label': ariaLabel,
  'aria-describedby': describedBy,
  'aria-invalid': ariaInvalid,
}) {
  const uid = useId().replace(/:/g, '');
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState(null);
  const [filter, setFilter] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const listRef = useRef(null);
  const searchRef = useRef(null);
  const unmountTimer = useRef(0);

  const canSearch = searchable ?? options.length > 7;
  const invalid = ariaInvalid === true || ariaInvalid === 'true';
  const selected = options.find((o) => o.value === value);
  const shown = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? options.filter((o) => String(o.label).toLowerCase().includes(q)) : options;
  }, [options, filter]);
  const optId = (o) => `${uid}-o-${String(o.value).replace(/[^\w-]/g, '_')}`;
  const active = shown[activeIdx];

  const openList = () => {
    clearTimeout(unmountTimer.current);
    setFilter('');
    setActiveIdx(Math.max(0, options.findIndex((o) => o.value === value)));
    setPos(null);
    setMounted(true);
    setOpen(true);
  };
  const close = (refocus = true) => {
    setOpen(false);
    // Keep the panel mounted for the fade-out
    unmountTimer.current = setTimeout(() => setMounted(false), 160);
    if (refocus) triggerRef.current?.focus({ preventScroll: true });
  };
  const choose = (o) => {
    if (o.value !== value) onChange(o.value);
    close();
  };
  useEffect(() => () => clearTimeout(unmountTimer.current), []);

  // Position the floating panel under (or above) the trigger
  const place = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const r = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(Math.max(r.width, panelMinWidth), vw - 16);
    const left = Math.max(8, Math.min(align === 'right' ? r.right - width : r.left, vw - width - 8));
    const below = vh - r.bottom - 14;
    const above = r.top - 14;
    const natural = Math.min(380, panelRef.current?.scrollHeight || 380);
    const up = below < natural && above > below;
    const space = up ? above : below;
    setPos({
      left,
      width,
      up,
      top: up ? undefined : r.bottom + 6,
      bottom: up ? vh - r.top + 6 : undefined,
      listMax: Math.max(120, Math.min(320, space - (canSearch ? 60 : 14))),
    });
  }, [panelMinWidth, align, canSearch]);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() => (searchRef.current || listRef.current)?.focus({ preventScroll: true }));
    const onDown = (e) => {
      if (!triggerRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) close(false);
    };
    // Capture phase: Escape closes this list before a surrounding modal sees it
    const onEsc = (e) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      e.stopImmediatePropagation();
      close();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown, { passive: true });
    document.addEventListener('keydown', onEsc, true);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onEsc, true);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, place]);

  // Keep the highlighted option in view while using the arrow keys
  useEffect(() => {
    if (open) listRef.current?.querySelector(`[data-idx="${activeIdx}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIdx]);

  const onPanelKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, shown.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (active) choose(active);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      close();
    }
    e.stopPropagation();
  };

  const isPill = variant === 'pill';

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${uid}-list` : undefined}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        onClick={(e) => {
          e.stopPropagation(); // never trigger a clickable table row underneath
          if (open) close();
          else openList();
        }}
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            openList();
          }
        }}
        className={cn(
          isPill
            ? 'inline-flex items-center gap-1.5 transition'
            : cn(
                'flex w-full items-center gap-2.5 rounded-[10px] border bg-white pr-3 text-left transition duration-150',
                HEIGHTS[size],
                selected?.thumb ? 'pl-1.5' : 'pl-3.5',
                open ? 'border-brand ring-4 ring-brand/10' : invalid ? 'border-red-400' : 'border-line hover:border-brand/40',
              ),
          triggerClassName,
        )}
      >
        <Lead option={selected} />
        {isPill ? (
          <span>{selected?.label ?? placeholder}</span>
        ) : (
          <span className="min-w-0 flex-1">
            {caption && <span className="block text-[10px] font-bold uppercase leading-none tracking-[0.12em] text-muted">{caption}</span>}
            <span className={cn('block truncate', caption && 'mt-1 leading-tight', selected ? 'font-semibold text-ink' : 'text-[#98A2B3]', caption && selected && 'font-bold')}>
              {selected ? selected.label : placeholder}
            </span>
          </span>
        )}
        {!isPill && selected?.count != null && (
          <span className="shrink-0 rounded-full bg-brand-tint px-2 py-0.5 text-[11px] font-bold text-brand">{selected.count}</span>
        )}
        <ChevronDown
          className={cn('shrink-0 transition-transform duration-200', isPill ? 'h-3.5 w-3.5 opacity-70' : 'h-4 w-4 text-muted', open && 'rotate-180', open && !isPill && 'text-brand')}
          aria-hidden="true"
        />
      </button>

      {mounted &&
        createPortal(
          <div
            ref={panelRef}
            onKeyDown={onPanelKey}
            onClick={(e) => e.stopPropagation()}
            style={
              pos
                ? { left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, '--dy': pos.up ? '6px' : '-6px' }
                : { left: 0, top: 0, visibility: 'hidden' }
            }
            className={cn(
              'fixed z-[95] rounded-2xl border border-line bg-white p-1.5 shadow-float',
              pos?.up ? 'origin-bottom' : 'origin-top',
              open ? 'dropdown-in' : 'dropdown-out pointer-events-none',
            )}
          >
            {canSearch && (
              <div className="relative mb-1.5">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
                <input
                  ref={searchRef}
                  type="text"
                  value={filter}
                  onChange={(e) => {
                    setFilter(e.target.value);
                    setActiveIdx(0);
                  }}
                  placeholder={searchPlaceholder}
                  aria-label={searchPlaceholder.replace(/…$/, '')}
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={`${uid}-list`}
                  aria-activedescendant={active ? optId(active) : undefined}
                  aria-autocomplete="list"
                  className="input h-10 rounded-xl border-transparent bg-soft pl-9 text-[13px] focus:bg-white"
                />
              </div>
            )}
            <ul
              ref={listRef}
              id={`${uid}-list`}
              role="listbox"
              aria-label={listLabel}
              tabIndex={-1}
              aria-activedescendant={!canSearch && active ? optId(active) : undefined}
              style={{ maxHeight: pos?.listMax }}
              className="space-y-0.5 overflow-y-auto overscroll-contain focus:outline-none"
            >
              {shown.map((o, i) => {
                const isSelected = o.value === value;
                return (
                  <li
                    key={o.value}
                    id={optId(o)}
                    role="option"
                    aria-selected={isSelected}
                    data-idx={i}
                    onMouseMove={() => i !== activeIdx && setActiveIdx(i)}
                    onClick={() => choose(o)}
                    style={{ '--d': `${Math.min(i, 10) * 25}ms` }}
                    className={cn(
                      'flex cursor-pointer items-center gap-2.5 rounded-xl pr-2 transition-colors duration-150',
                      o.thumb ? 'py-1.5 pl-1.5' : 'py-2 pl-3',
                      open && 'dropdown-item',
                      i === activeIdx && 'bg-brand-tint',
                    )}
                  >
                    <Lead option={o} />
                    <span className={cn('min-w-0 flex-1 truncate text-sm font-semibold', isSelected ? 'text-brand' : 'text-ink')}>{o.label}</span>
                    {o.count != null && (
                      <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold', isSelected ? 'bg-brand text-white' : 'bg-soft text-muted')}>
                        {o.count}
                      </span>
                    )}
                    <Check className={cn('h-4 w-4 shrink-0 text-brand', !isSelected && 'invisible')} aria-hidden="true" />
                  </li>
                );
              })}
              {!shown.length && <li className="px-3 py-6 text-center text-sm text-muted">No match for “{filter}”</li>}
            </ul>
          </div>,
          document.body,
        )}
    </>
  );
}
