import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Copy, Download, Eye, FileSpreadsheet, Inbox, Trash2 } from 'lucide-react';
import { AdminPageHeader } from './AdminLayout';
import { EnquiryDetailModal, StatusSelect } from './enquiryParts';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { ENQUIRY_STATUSES } from '../lib/seed';
import { cn, downloadText, formatDate, formatQty, itemsSummary, toCsv } from '../lib/utils';

function buildCsv(list) {
  const header = ['ID', 'Date', 'Status', 'Name', 'Company', 'Country', 'Email', 'Phone', 'Products', 'Total quantity', 'Message', 'Source'];
  const rows = list.map((e) => [
    e.id,
    formatDate(e.createdAt, true),
    e.status,
    e.name,
    e.company,
    e.country,
    e.email,
    e.phone,
    itemsSummary(e.items) === '—' ? '' : itemsSummary(e.items),
    (e.items || []).reduce((s, i) => s + Number(i.qty || 0), 0) || '',
    e.message,
    e.source,
  ]);
  return toCsv([header, ...rows]);
}

export default function AdminEnquiries() {
  const { enquiries, settings, setEnquiryStatus, deleteEnquiry } = useStore();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const tab = ENQUIRY_STATUSES.includes(params.get('status')) ? params.get('status') : 'All';
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [csvOpen, setCsvOpen] = useState(false);

  const sorted = useMemo(() => [...enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [enquiries]);
  const rows = tab === 'All' ? sorted : sorted.filter((e) => e.status === tab);
  const counts = Object.fromEntries(ENQUIRY_STATUSES.map((s) => [s, enquiries.filter((e) => e.status === s).length]));
  const viewed = viewing && enquiries.find((e) => e.id === viewing);
  const csv = useMemo(() => (csvOpen ? buildCsv(rows) : ''), [csvOpen, rows]);

  const changeStatus = (e, status) => {
    if (setEnquiryStatus(e.id, status)) toast(`${e.name}’s enquiry marked as ${status}`);
  };

  const confirmDelete = () => {
    if (deleteEnquiry(deleting.id)) toast(`Enquiry from ${deleting.name} deleted`);
    if (viewing === deleting.id) setViewing(null);
    setDeleting(null);
  };

  const copyCsv = async () => {
    try {
      await navigator.clipboard.writeText(csv);
      toast('CSV copied to clipboard');
    } catch {
      toast('Could not copy automatically — select the text and press Ctrl+C', 'error');
    }
  };

  const download = () => {
    const name = `vk-india-enquiries-${tab.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.csv`;
    if (downloadText(name, csv)) toast(`Downloaded ${name}`);
    else toast('Download failed — use “Copy to clipboard” instead', 'error');
  };

  return (
    <>
      <AdminPageHeader
        title="Enquiries"
        subtitle="Requests for quotation from the website’s My Enquiry and contact form"
        actions={
          <button type="button" className="btn btn-blue" onClick={() => setCsvOpen(true)} disabled={!rows.length}>
            <FileSpreadsheet className="h-4 w-4" aria-hidden="true" /> Export CSV
          </button>
        }
      />

      <div className="no-scrollbar -mx-4 mb-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter by status">
        {['All', ...ENQUIRY_STATUSES].map((s) => {
          const active = s === tab;
          const n = s === 'All' ? enquiries.length : counts[s];
          return (
            <button
              key={s}
              type="button"
              aria-pressed={active}
              onClick={() => setParams(s === 'All' ? {} : { status: s }, { replace: true })}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition',
                active ? 'bg-white text-brand shadow-card ring-1 ring-line' : 'text-muted hover:bg-white/70 hover:text-ink',
              )}
            >
              {s}
              <span className={cn('rounded-full px-2 py-px text-[11px] font-bold', active ? 'bg-brand text-white' : s === 'New' && n ? 'bg-accent text-white' : 'bg-line text-muted')}>
                {n}
              </span>
            </button>
          );
        })}
      </div>

      <div className="card overflow-hidden">
        {rows.length ? (
          <>
          {/* Phones: one card per enquiry */}
          <ul className="divide-y divide-line md:hidden">
            {rows.map((e) => (
              <li key={e.id} className={cn('p-4', e.status === 'New' && 'bg-accent-tint/30')}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{e.name}</p>
                    <p className="truncate text-xs text-muted">{[e.company, e.country].filter(Boolean).join(' · ') || '—'}</p>
                  </div>
                  <div className="relative shrink-0">
                    <StatusSelect id={`m-status-${e.id}`} label={`Status for ${e.name}`} value={e.status} onChange={(s) => changeStatus(e, s)} />
                  </div>
                </div>
                <div className="mt-2.5 rounded-lg bg-soft px-3 py-2 text-[13px]">
                  {e.items?.length ? (
                    <ul className="space-y-0.5">
                      {e.items.map((i) => (
                        <li key={i.productId} className="flex justify-between gap-3">
                          <span className="min-w-0 truncate text-ink">{i.name}</span>
                          <span className="shrink-0 font-semibold tabular-nums text-muted">× {formatQty(i.qty)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="italic text-muted">General enquiry</span>
                  )}
                </div>
                <p className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
                  <a href={`mailto:${e.email}`} className="text-brand hover:underline">{e.email}</a>
                  {e.phone && <span>{e.phone}</span>}
                  <span>{formatDate(e.createdAt)}</span>
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => setViewing(e.id)} aria-label={`View enquiry from ${e.name}`}>
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" /> View
                  </button>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleting(e)} aria-label={`Delete enquiry from ${e.name}`}>
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="relative hidden overflow-x-auto md:block">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-soft text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Products × qty</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((e) => (
                  <tr key={e.id} className={cn('align-top hover:bg-soft/60', e.status === 'New' && 'bg-accent-tint/30')}>
                    <td className="px-4 py-3.5">
                      <p className="font-semibold text-ink">{e.name}</p>
                      <p className="text-xs text-muted">{[e.company, e.country].filter(Boolean).join(' · ') || '—'}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <a href={`mailto:${e.email}`} className="block text-brand hover:underline">
                        {e.email}
                      </a>
                      <p className="text-xs text-muted">{e.phone || '—'}</p>
                    </td>
                    <td className="max-w-[280px] px-4 py-3.5">
                      {e.items?.length ? (
                        <ul className="space-y-0.5">
                          {e.items.map((i) => (
                            <li key={i.productId} className="text-ink">
                              {i.name} <span className="font-semibold text-muted">× {formatQty(i.qty)}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="italic text-muted">General enquiry</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-muted">{formatDate(e.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <StatusSelect id={`status-${e.id}`} label={`Status for ${e.name}`} value={e.status} onChange={(s) => changeStatus(e, s)} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button type="button" className="btn btn-outline btn-sm" onClick={() => setViewing(e.id)} aria-label={`View enquiry from ${e.name}`}>
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" /> View
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleting(e)} aria-label={`Delete enquiry from ${e.name}`}>
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
            icon={Inbox}
            title={tab === 'All' ? 'No enquiries yet' : `No ${tab.toLowerCase()} enquiries`}
            text={
              tab === 'All'
                ? 'When buyers send My Enquiry or the contact form, it will show up here.'
                : `Enquiries you mark as “${tab}” will appear in this tab.`
            }
            action={
              tab !== 'All' && (
                <button type="button" className="btn btn-outline" onClick={() => setParams({}, { replace: true })}>
                  Show all enquiries
                </button>
              )
            }
          />
        )}
      </div>

      {viewed && (
        <EnquiryDetailModal enquiry={viewed} salesEmail={settings.salesEmail} onClose={() => setViewing(null)} onStatus={changeStatus} onDelete={(e) => setDeleting(e)} />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete this enquiry?"
        message={
          <>
            The enquiry from <strong className="text-ink">{deleting?.name}</strong>
            {deleting?.company ? ` (${deleting.company})` : ''} will be permanently deleted.
          </>
        }
      />

      <Modal
        open={csvOpen}
        onClose={() => setCsvOpen(false)}
        size="lg"
        title="Export enquiries"
        subtitle={`${rows.length} ${rows.length === 1 ? 'enquiry' : 'enquiries'} · ${tab === 'All' ? 'all statuses' : tab}`}
        footer={
          <>
            <button type="button" className="btn btn-outline" onClick={copyCsv}>
              <Copy className="h-4 w-4" aria-hidden="true" /> Copy to clipboard
            </button>
            <button type="button" className="btn btn-blue" onClick={download} data-autofocus>
              <Download className="h-4 w-4" aria-hidden="true" /> Download .csv
            </button>
          </>
        }
      >
        <p className="mb-3 text-sm text-muted">Opens in Excel or Google Sheets. You can also copy the text below.</p>
        <label htmlFor="csv-text" className="sr-only">
          CSV text
        </label>
        <textarea id="csv-text" readOnly value={csv} className="input h-64 resize-none font-mono text-xs leading-relaxed" onFocus={(e) => e.target.select()} />
      </Modal>
    </>
  );
}
