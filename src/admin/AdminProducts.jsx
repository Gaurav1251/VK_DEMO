import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Eye, PackageSearch, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react';
import { AdminPageHeader } from './AdminLayout';
import ProductFormModal from './ProductFormModal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import ProductImage from '../components/ui/ProductImage';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { cn } from '../lib/utils';

export default function AdminProducts() {
  const { products, categories, toggleProductActive, deleteProduct } = useStore();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [editing, setEditing] = useState(null); // null | 'new' | product
  const [deleting, setDeleting] = useState(null);
  const catName = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  // Dashboard "+ Add product" links here with ?new=1
  useEffect(() => {
    if (params.get('new')) {
      setEditing('new');
      const next = new URLSearchParams(params);
      next.delete('new');
      setParams(next, { replace: true });
    }
  }, [params, setParams]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) => (category === 'all' || p.categoryId === category) && (!q || `${p.name} ${p.material} ${p.short}`.toLowerCase().includes(q)),
    );
  }, [products, query, category]);

  const onToggle = (p) => {
    if (toggleProductActive(p.id)) toast(p.active ? `“${p.name}” is now hidden from the website` : `“${p.name}” is now visible on the website`, 'info');
  };

  const onDelete = () => {
    if (deleteProduct(deleting.id)) toast(`“${deleting.name}” deleted`);
    setDeleting(null);
  };

  return (
    <>
      <AdminPageHeader
        title="Products"
        subtitle={`${products.length} products · ${products.filter((p) => p.active).length} visible on the website`}
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Add product
          </button>
        }
      />

      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <label htmlFor="admin-product-search" className="sr-only">
              Search products
            </label>
            <input id="admin-product-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or material…" className="input pl-10" />
          </div>
          <label htmlFor="admin-product-cat" className="sr-only">
            Filter by category
          </label>
          <select id="admin-product-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="input sm:w-60">
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {rows.length ? (
          <>
          {/* Phones: one card per product */}
          <ul className="divide-y divide-line md:hidden">
            {rows.map((p) => (
              <li key={p.id} className="p-4">
                <div className="flex gap-3">
                  <ProductImage item={p} className="h-16 w-20 shrink-0 border border-line" rounded="rounded-lg" drawingClassName="w-[95%]" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-snug text-ink">{p.name}</p>
                    <p className="mt-0.5 truncate text-xs text-muted">
                      {catName[p.categoryId] || 'Missing category'} · {p.material || '—'}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggle(p)}
                        className={cn('status-pill', p.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600')}
                        aria-label={`${p.name} is ${p.active ? 'active' : 'hidden'}. Tap to ${p.active ? 'hide' : 'show'}.`}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', p.active ? 'bg-emerald-500' : 'bg-slate-400')} aria-hidden="true" />
                        {p.active ? 'Active' : 'Hidden'}
                      </button>
                      {p.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-tint px-2.5 py-1 text-xs font-bold text-[#C2410C]">
                          <Star className="h-3 w-3 fill-current" aria-hidden="true" /> Popular
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <a href={`/products/${p.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" aria-label={`View ${p.name} on website`}>
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" /> View
                  </a>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleting(p)} aria-label={`Delete ${p.name}`}>
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="relative hidden overflow-x-auto md:block">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-soft text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Product</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Popular</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((p) => (
                  <tr key={p.id} className="hover:bg-soft/60">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProductImage item={p} className="h-12 w-14 shrink-0 border border-line" rounded="rounded-lg" drawingClassName="w-[95%]" />
                        <div className="min-w-0">
                          <p className="font-semibold text-ink">{p.name}</p>
                          <p className="truncate text-xs text-muted">{p.material || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{catName[p.categoryId] || <span className="text-red-600">Missing</span>}</td>
                    <td className="px-4 py-3">
                      {p.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-accent-tint px-2.5 py-1 text-xs font-bold text-[#C2410C]">
                          <Star className="h-3 w-3 fill-current" aria-hidden="true" /> Popular
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onToggle(p)}
                        className={cn('status-pill transition hover:ring-2 hover:ring-offset-1', p.active ? 'bg-emerald-50 text-emerald-700 hover:ring-emerald-200' : 'bg-slate-100 text-slate-600 hover:ring-slate-200')}
                        title="Click to toggle visibility"
                        aria-label={`${p.name} is ${p.active ? 'active' : 'hidden'}. Click to ${p.active ? 'hide' : 'show'}.`}
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full', p.active ? 'bg-emerald-500' : 'bg-slate-400')} aria-hidden="true" />
                        {p.active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <a href={`/products/${p.id}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" aria-label={`View ${p.name} on website`}>
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" /> View
                        </a>
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}>
                          <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleting(p)} aria-label={`Delete ${p.name}`}>
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        ) : (
          <EmptyState
            icon={PackageSearch}
            title={products.length ? 'No products match your filters' : 'No products yet'}
            text={products.length ? 'Try a different search term or category.' : 'Add your first product to show it on the website.'}
            action={
              products.length ? (
                <button type="button" className="btn btn-outline" onClick={() => (setQuery(''), setCategory('all'))}>
                  Clear filters
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add product
                </button>
              )
            }
          />
        )}
      </div>

      <ProductFormModal open={Boolean(editing)} product={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={onDelete}
        title="Delete this product?"
        message={
          <>
            <strong className="text-ink">{deleting?.name}</strong> will be removed from the website and from any visitor’s My Enquiry. Past enquiries
            that mention it are kept. This cannot be undone.
          </>
        }
      />
    </>
  );
}
