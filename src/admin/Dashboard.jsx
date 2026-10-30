import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BellDot, FolderTree, Inbox, Package, Plus } from 'lucide-react';
import { AdminPageHeader } from './AdminLayout';
import { EnquiryDetailModal, StatusPill } from './enquiryParts';
import EmptyState from '../components/ui/EmptyState';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { formatDate, itemsSummary } from '../lib/utils';

function StatCard({ icon: Icon, label, value, tone, to }) {
  return (
    <Link to={to} className="card card-glow group flex items-center gap-4 p-5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted">{label}</p>
        <p className="text-[28px] font-extrabold leading-tight text-ink tabular-nums">{value}</p>
      </div>
      <ArrowRight className="ml-auto h-4 w-4 text-muted opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
    </Link>
  );
}

export default function Dashboard() {
  const { products, categories, enquiries, settings, setEnquiryStatus } = useStore();
  const toast = useToast();
  const [viewing, setViewing] = useState(null);
  const newCount = enquiries.filter((e) => e.status === 'New').length;
  const latest = [...enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const viewed = viewing && enquiries.find((e) => e.id === viewing);

  const byCategory = categories
    .map((c) => ({ ...c, count: products.filter((p) => p.categoryId === c.id).length }))
    .sort((a, b) => b.count - a.count);
  const max = Math.max(1, ...byCategory.map((c) => c.count));

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        subtitle={`Overview of your catalogue and enquiries · ${formatDate(new Date().toISOString())}`}
        actions={
          <Link to="/admin/products?new=1" className="btn btn-primary">
            <Plus className="h-4 w-4" aria-hidden="true" /> Add product
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package} label="Total products" value={products.length} tone="bg-brand-tint text-brand" to="/admin/products" />
        <StatCard icon={FolderTree} label="Categories" value={categories.length} tone="bg-violet-50 text-violet-600" to="/admin/categories" />
        <StatCard icon={Inbox} label="Total enquiries" value={enquiries.length} tone="bg-emerald-50 text-emerald-600" to="/admin/enquiries" />
        <StatCard icon={BellDot} label="New enquiries" value={newCount} tone="bg-accent-tint text-accent" to="/admin/enquiries?status=New" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="text-base font-bold">Latest enquiries</h2>
            <Link to="/admin/enquiries" className="text-sm font-semibold text-brand hover:underline">
              View all
            </Link>
          </div>
          {latest.length ? (
            <>
            {/* Phones: tappable rows */}
            <ul className="divide-y divide-line md:hidden">
              {latest.map((e) => (
                <li key={e.id}>
                  <button type="button" onClick={() => setViewing(e.id)} className="block w-full px-5 py-3.5 text-left transition hover:bg-brand-tint/50" aria-label={`View enquiry from ${e.name}`}>
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block font-semibold text-ink">{e.name}</span>
                        <span className="block truncate text-xs text-muted">{e.company || '—'}</span>
                      </span>
                      <StatusPill status={e.status} />
                    </span>
                    <span className="mt-1.5 block truncate text-[13px] text-muted">
                      {itemsSummary(e.items) === '—' ? 'General enquiry' : itemsSummary(e.items)} · {formatDate(e.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="relative hidden overflow-x-auto md:block">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-soft text-left text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Customer</th>
                    <th className="px-5 py-3 font-semibold">Products</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {latest.map((e) => (
                    <tr
                      key={e.id}
                      onClick={() => setViewing(e.id)}
                      onKeyDown={(ev) => (ev.key === 'Enter' || ev.key === ' ') && (ev.preventDefault(), setViewing(e.id))}
                      tabIndex={0}
                      className="cursor-pointer transition hover:bg-brand-tint/50 focus:bg-brand-tint/50 focus:outline-none"
                      aria-label={`View enquiry from ${e.name}`}
                    >
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-ink">{e.name}</p>
                        <p className="text-xs text-muted">{e.company || '—'}</p>
                      </td>
                      <td className="max-w-[220px] truncate px-5 py-3.5 text-muted">{itemsSummary(e.items) === '—' ? 'General enquiry' : itemsSummary(e.items)}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-muted">{formatDate(e.createdAt)}</td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={e.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          ) : (
            <EmptyState compact icon={Inbox} title="No enquiries yet" text="Enquiries from the website’s My Enquiry and contact form will appear here." />
          )}
        </section>

        <section className="card p-5">
          <h2 className="text-base font-bold">Products by category</h2>
          <p className="mt-0.5 text-xs text-muted">Number of products in each category</p>
          {byCategory.length ? (
            <ul className="mt-5 space-y-3.5">
              {byCategory.map((c) => (
                <li key={c.id} title={`${c.name}: ${c.count} ${c.count === 1 ? 'product' : 'products'}`}>
                  <div className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="truncate font-semibold text-ink">{c.name}</span>
                    <span className="font-bold tabular-nums text-ink">{c.count}</span>
                  </div>
                  <div className="mt-1.5 h-2.5 rounded-full bg-soft" aria-hidden="true">
                    <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${c.count ? Math.max(4, (c.count / max) * 100) : 0}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState compact icon={FolderTree} title="No categories" text="Add a category to start organising products." />
          )}
        </section>
      </div>

      {viewed && (
        <EnquiryDetailModal
          enquiry={viewed}
          salesEmail={settings.salesEmail}
          onClose={() => setViewing(null)}
          onStatus={(e, status) => {
            setEnquiryStatus(e.id, status);
            toast(`Status changed to ${status}`);
          }}
        />
      )}
    </>
  );
}
