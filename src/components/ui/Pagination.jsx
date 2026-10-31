import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Select from './Select';
import { cn } from '../../lib/utils';

/**
 * Client-side paging for a list. Goes back to page 1 whenever `resetKey` changes (e.g. a new search),
 * and never points past the last page when items are deleted.
 */
export function usePagination(items, initialSize = 10, resetKey = '') {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(initialSize);

  useEffect(() => {
    setPage(1);
  }, [resetKey]);

  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(page, pages);
  const start = (current - 1) * size;
  return {
    items: items.slice(start, start + size),
    page: current,
    pages,
    size,
    start,
    total: items.length,
    setPage,
    setSize: (s) => {
      setSize(s);
      setPage(1);
    },
  };
}

// 1 … 4 5 6 … 12 — always the first, last and the pages either side of the current one
function pageList(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const list = [1];
  const from = Math.max(2, Math.min(page - 1, pages - 4));
  const to = Math.min(pages - 1, Math.max(page + 1, 5));
  if (from > 2) list.push('…');
  for (let p = from; p <= to; p++) list.push(p);
  if (to < pages - 1) list.push('…');
  list.push(pages);
  return list;
}

/** Footer bar for a paginated card: "Showing 1–10 of 21", rows per page, and page buttons. */
export default function Pagination({ pager, label = 'items', sizes = [5, 10, 20, 50] }) {
  const ref = useRef(null);
  const { page, pages, size, start, total, setPage, setSize } = pager;
  if (!total) return null;
  const end = Math.min(start + size, total);

  const go = (p) => {
    setPage(p);
    // Moving to another page from the bottom of a long list: bring the top of the list back into view
    const card = ref.current?.closest('[data-paginated]');
    if (card && card.getBoundingClientRect().top < 0) card.scrollIntoView({ block: 'start' });
  };

  const arrow = 'btn btn-outline btn-sm h-9 px-2.5 sm:px-3';

  return (
    <div ref={ref} className="flex flex-col gap-3 border-t border-line bg-soft/50 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center justify-between gap-4 text-muted sm:justify-start">
        <p aria-live="polite">
          Showing <span className="font-semibold text-ink">{start + 1}–{end}</span> of <span className="font-semibold text-ink">{total}</span> {label}
        </p>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span className="text-[13px]" aria-hidden="true">
            Per page
          </span>
          <div className="w-[76px]">
            <Select
              size="sm"
              aria-label={`${label} per page`}
              listLabel="Per page"
              panelMinWidth={96}
              value={size}
              onChange={setSize}
              options={sizes.map((s) => ({ value: s, label: String(s) }))}
            />
          </div>
        </div>
      </div>

      <nav aria-label={`${label} pages`} className="flex items-center justify-between gap-1.5 sm:justify-end">
        <button type="button" className={arrow} onClick={() => go(page - 1)} disabled={page === 1} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          <span className="sm:hidden">Prev</span>
        </button>
        <span className="font-semibold text-ink sm:hidden">
          Page {page} of {pages}
        </span>
        <ul className="hidden items-center gap-1 sm:flex">
          {pageList(page, pages).map((p, i) =>
            p === '…' ? (
              <li key={`gap-${i}`} className="px-1 text-muted" aria-hidden="true">
                …
              </li>
            ) : (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => go(p)}
                  aria-current={p === page ? 'page' : undefined}
                  aria-label={`Page ${p}`}
                  className={cn(
                    'flex h-9 min-w-9 items-center justify-center rounded-[10px] px-2 text-[13px] font-semibold transition',
                    p === page ? 'bg-brand text-white shadow-sm' : 'border border-line bg-white text-ink hover:border-brand hover:text-brand',
                  )}
                >
                  {p}
                </button>
              </li>
            ),
          )}
        </ul>
        <button type="button" className={arrow} onClick={() => go(page + 1)} disabled={page === pages} aria-label="Next page">
          <span className="sm:hidden">Next</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>
    </div>
  );
}
