import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PackageSearch, Search, X } from 'lucide-react';
import PageHeader from '../components/site/PageHeader';
import ProductCard from '../components/site/ProductCard';
import EmptyState from '../components/ui/EmptyState';
import { usePublicCatalog } from '../context/StoreContext';
import { cn } from '../lib/utils';
import { CtaBanner } from './Home';

export default function Products() {
  const { products, categories, categoryById, counts } = usePublicCatalog();
  const [params, setParams] = useSearchParams();
  const active = categoryById[params.get('category')] ? params.get('category') : 'all';
  const query = params.get('q') || '';

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (active !== 'all' && p.categoryId !== active) return false;
      if (!q) return true;
      const hay = [p.name, p.short, p.material, p.sizes, categoryById[p.categoryId]?.name].join(' ').toLowerCase();
      return q.split(/\s+/).every((word) => hay.includes(word));
    });
  }, [products, active, query, categoryById]);

  const pills = [{ id: 'all', name: 'All products', count: products.length }, ...categories.map((c) => ({ ...c, count: counts[c.id] || 0 }))];
  const activeName = active === 'all' ? 'All products' : categoryById[active].name;

  return (
    <>
      <PageHeader
        title="Our Products"
        image="/images/vk-brass-parts-banner.jpg"
        imagePosition="right center"
        subtitle="Precision brass, copper and steel components for electrical, plumbing, automotive, oil & gas and engineering applications."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Products' }]}
      />

      <section className="container-x py-10 sm:py-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by category">
            {pills.map((pill) => {
              const selected = pill.id === active;
              return (
                <button
                  key={pill.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setParam('category', pill.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
                    selected ? 'border-brand bg-brand text-white shadow-sm' : 'border-line bg-white text-ink hover:border-brand/40 hover:text-brand',
                  )}
                >
                  {pill.name}
                  <span className={cn('rounded-full px-1.5 py-px text-[11px] font-bold', selected ? 'bg-white/20 text-white' : 'bg-soft text-muted')}>
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full shrink-0 lg:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder="Search parts, sizes, materials…"
              className="input pl-10 pr-9"
            />
            {query && (
              <button type="button" onClick={() => setParam('q', '')} className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink" aria-label="Clear search">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          Showing <span className="font-semibold text-ink">{results.length}</span> {results.length === 1 ? 'product' : 'products'} in{' '}
          <span className="font-semibold text-ink">{activeName}</span>
          {query && (
            <>
              {' '}
              for “<span className="font-semibold text-ink">{query}</span>”
            </>
          )}
        </p>

        {results.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} category={categoryById[p.categoryId]} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-soft">
            <EmptyState
              icon={PackageSearch}
              title="No products match your search"
              text={
                query
                  ? `We couldn’t find “${query}”${active !== 'all' ? ` in ${activeName}` : ''}. Try a different word, check all categories — or send us your drawing and we’ll make it.`
                  : 'There are no products in this category yet. Send us your requirement and we’ll make it to your drawing.'
              }
              action={
                <div className="flex flex-wrap justify-center gap-2.5">
                  <button type="button" className="btn btn-outline" onClick={() => setParams({}, { replace: true })}>
                    Clear filters
                  </button>
                  <Link to="/contact" className="btn btn-primary">
                    Send a requirement
                  </Link>
                </div>
              }
            />
          </div>
        )}
      </section>

      <CtaBanner />
    </>
  );
}
