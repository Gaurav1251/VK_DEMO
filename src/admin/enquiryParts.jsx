import { Mail, Trash2 } from 'lucide-react';
import Modal from '../components/ui/Modal';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { ENQUIRY_STATUSES } from '../lib/seed';
import { cn, formatDate, formatQty, telHref, whatsappLink } from '../lib/utils';

export const STATUS_STYLES = {
  New: { pill: 'bg-accent-tint text-[#C2410C]', dot: 'bg-accent' },
  Contacted: { pill: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  Quoted: { pill: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500' },
  Closed: { pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
};

export function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.New;
  return (
    <span className={cn('status-pill', s.pill)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', s.dot)} aria-hidden="true" />
      {status}
    </span>
  );
}

export function StatusSelect({ value, onChange, id, label = 'Status' }) {
  const s = STATUS_STYLES[value] || STATUS_STYLES.New;
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'cursor-pointer appearance-none rounded-full border-0 bg-[length:14px] bg-[right_8px_center] bg-no-repeat py-1 pl-3 pr-7 text-xs font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          s.pill,
        )}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%235B6878' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
      >
        {ENQUIRY_STATUSES.map((st) => (
          <option key={st} value={st}>
            {st}
          </option>
        ))}
      </select>
    </>
  );
}

export function replyMailto(enquiry, salesEmail) {
  const products = enquiry.items?.length ? enquiry.items.map((i) => `- ${i.name}: ${formatQty(i.qty)} pcs`).join('\n') : '';
  const subject = `Re: Your enquiry to VK India${enquiry.items?.length ? ` — ${enquiry.items[0].name}` : ''}`;
  const body = `Dear ${enquiry.name},\n\nThank you for your enquiry${products ? ' for:\n' + products + '\n' : '.'}\n\n\n\nBest regards,\nVK India Incorporation\n${salesEmail}`;
  return `mailto:${enquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function EnquiryDetailModal({ enquiry, onClose, onStatus, onDelete, salesEmail }) {
  if (!enquiry) return null;
  const rows = [
    ['Name', enquiry.name],
    ['Company', enquiry.company || '—'],
    ['Country', enquiry.country || '—'],
    ['Email', <a key="e" href={`mailto:${enquiry.email}`} className="text-brand hover:underline">{enquiry.email}</a>],
    ['Phone', enquiry.phone ? <a key="p" href={telHref(enquiry.phone)} className="text-brand hover:underline">{enquiry.phone}</a> : '—'],
    ['Received', formatDate(enquiry.createdAt, true)],
    ['Source', enquiry.source || 'Website'],
  ];
  const total = (enquiry.items || []).reduce((sum, i) => sum + Number(i.qty || 0), 0);
  const waText = `Hello ${enquiry.name}, this is VK India regarding your enquiry${enquiry.items?.length ? ` for ${enquiry.items.map((i) => i.name).join(', ')}` : ''}.`;

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      title={enquiry.name}
      subtitle={`${enquiry.company ? `${enquiry.company} · ` : ''}Enquiry ${enquiry.id.toUpperCase()}`}
      footer={
        <>
          {onDelete && (
            <button type="button" className="btn btn-danger mr-auto" onClick={() => onDelete(enquiry)}>
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
            </button>
          )}
          {enquiry.phone && (
            <a href={whatsappLink(enquiry.phone, waText)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          )}
          <a href={replyMailto(enquiry, salesEmail)} className="btn btn-blue">
            <Mail className="h-4 w-4" aria-hidden="true" /> Reply by email
          </a>
        </>
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-soft px-4 py-3">
        <span className="text-sm font-semibold text-muted">Status</span>
        <StatusSelect id={`modal-status-${enquiry.id}`} value={enquiry.status} onChange={(s) => onStatus(enquiry, s)} />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-line">
        <dl className="divide-y divide-line text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-2.5 sm:grid-cols-[140px_1fr]">
              <dt className="font-medium text-muted">{label}</dt>
              <dd className="break-words font-semibold text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h3 className="mt-6 text-sm font-bold">Products requested</h3>
      {enquiry.items?.length ? (
        <div className="mt-2 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-soft text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Product</th>
                <th className="px-4 py-2.5 text-right font-semibold">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {enquiry.items.map((i) => (
                <tr key={i.productId}>
                  <td className="px-4 py-2.5 font-semibold">{i.name}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{formatQty(i.qty)} pcs</td>
                </tr>
              ))}
            </tbody>
            {enquiry.items.length > 1 && (
              <tfoot className="border-t border-line bg-soft/60">
                <tr>
                  <td className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-muted">Total</td>
                  <td className="px-4 py-2.5 text-right font-bold tabular-nums">{formatQty(total)} pcs</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      ) : (
        <p className="mt-2 rounded-xl border border-dashed border-line px-4 py-3 text-sm text-muted">General enquiry from the contact form — no specific products selected.</p>
      )}

      <h3 className="mt-6 text-sm font-bold">Message</h3>
      <p className="mt-2 whitespace-pre-wrap rounded-xl bg-soft px-4 py-3 text-sm leading-relaxed text-ink">{enquiry.message || <span className="text-muted">No message.</span>}</p>
    </Modal>
  );
}
