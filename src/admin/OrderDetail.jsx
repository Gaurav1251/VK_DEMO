import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ClipboardList, FileText, Inbox, Mail, MapPin, Pencil, Phone, Plus, Printer, ReceiptText, Trash2, UserRound } from 'lucide-react';
import OrderFormModal from './OrderFormModal';
import { OrderStatusSelect, PaidBar, PaymentFormModal, PaymentPill } from './orderParts';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import EmptyState from '../components/ui/EmptyState';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { formatDay, formatINR, invoiceNo, lineAmount, orderNo, orderTotals, paymentState, receiptNo } from '../lib/orders';
import { cn, formatQty, telHref, whatsappLink } from '../lib/utils';

function TotalRow({ label, value, strong, tone }) {
  return (
    <div className={cn('flex items-baseline justify-between gap-4 px-4 py-1.5 sm:px-5', strong && 'border-t border-line py-3')}>
      <dt className={strong ? 'font-bold text-ink' : 'text-muted'}>{label}</dt>
      <dd className={cn('tabular-nums', strong ? 'text-xl font-extrabold text-ink' : 'font-semibold text-ink', tone)}>{value}</dd>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const { orders, setOrderStatus, deleteOrder, deletePayment } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [paying, setPaying] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [removingPayment, setRemovingPayment] = useState(null);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="card">
        <EmptyState
          icon={ClipboardList}
          title="Order not found"
          text="It may have been deleted."
          action={
            <Link to="/admin/orders" className="btn btn-outline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All orders
            </Link>
          }
        />
      </div>
    );
  }

  const t = orderTotals(order);
  const state = paymentState(order, t);
  const c = order.customer || {};
  const cancelled = order.status === 'Cancelled';
  const payments = [...(order.payments || [])].sort((a, b) => a.date.localeCompare(b.date));
  const reminder = `Hello ${c.name}, this is VK India. A gentle reminder that ${formatINR(t.balance)} is pending against our bill ${invoiceNo(order)} dated ${formatDay(order.date)} (total ${formatINR(t.total)}, received ${formatINR(t.paid)}). Thank you!`;

  const onDelete = () => {
    if (deleteOrder(order.id)) toast(`${orderNo(order)} deleted`);
    navigate('/admin/orders', { replace: true });
  };

  const onRemovePayment = () => {
    if (deletePayment(order.id, removingPayment.id)) toast(`Payment of ${formatINR(removingPayment.amount)} removed`);
    setRemovingPayment(null);
  };

  return (
    <>
      <Link to="/admin/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-brand">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All orders
      </Link>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold sm:text-[28px]">Order {orderNo(order)}</h1>
            <OrderStatusSelect id="detail-status" value={order.status} onChange={(s) => setOrderStatus(order.id, s) && toast(`${orderNo(order)} marked as ${s}`)} />
          </div>
          <p className="mt-1 text-sm text-muted">
            {c.company || c.name} · Ordered {formatDay(order.date)}
            {order.deliveryDate && ` · Delivery by ${formatDay(order.deliveryDate)}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Delete
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" aria-hidden="true" /> Edit order
          </button>
          <Link to={`/admin/orders/${order.id}/bill`} className="btn btn-primary">
            <Printer className="h-4 w-4" aria-hidden="true" /> Bill / Invoice
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <section className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-5">
              <h2 className="text-base font-bold">Items</h2>
              <span className="text-xs font-semibold text-muted">{order.items.length} {order.items.length === 1 ? 'line' : 'lines'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead className="bg-soft text-left text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="w-10 px-4 py-2.5 font-semibold sm:pl-5">#</th>
                    <th className="px-4 py-2.5 font-semibold">Item</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Qty</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Rate</th>
                    <th className="px-4 py-2.5 text-right font-semibold sm:pr-5">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {order.items.map((i, n) => (
                    <tr key={i.id || n}>
                      <td className="px-4 py-3 text-muted sm:pl-5">{n + 1}</td>
                      <td className="px-4 py-3 font-semibold text-ink">{i.name}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                        {formatQty(i.qty)} <span className="text-muted">{i.unit}</span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">{formatINR(i.rate)}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-semibold tabular-nums sm:pr-5">{formatINR(lineAmount(i))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="border-t border-line bg-soft/50 py-2 text-sm">
              <TotalRow label="Subtotal" value={formatINR(t.subtotal)} />
              {t.discount > 0 && (
                <TotalRow
                  label={`Discount${order.discount?.type === 'percent' ? ` (${order.discount.value}%)` : ''}`}
                  value={`− ${formatINR(t.discount)}`}
                  tone="text-emerald-700"
                />
              )}
              {t.discount > 0 && t.rate > 0 && <TotalRow label="Taxable value" value={formatINR(t.taxable)} />}
              {t.rate > 0 &&
                (order.tax?.interState ? (
                  <TotalRow label={`IGST ${t.rate}%`} value={formatINR(t.igst)} />
                ) : (
                  <>
                    <TotalRow label={`CGST ${t.rate / 2}%`} value={formatINR(t.cgst)} />
                    <TotalRow label={`SGST ${t.rate / 2}%`} value={formatINR(t.sgst)} />
                  </>
                ))}
              {t.freight > 0 && <TotalRow label="Freight & other charges" value={formatINR(t.freight)} />}
              {t.roundOff !== 0 && <TotalRow label="Round off" value={`${t.roundOff > 0 ? '+' : '−'} ${formatINR(Math.abs(t.roundOff))}`} />}
              <TotalRow label="Bill total" value={formatINR(t.total)} strong />
            </dl>
          </section>

          {order.notes && (
            <section className="card p-4 sm:p-5">
              <h2 className="text-sm font-bold">Notes</h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-muted">{order.notes}</p>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <section className="card overflow-hidden">
            <div className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base font-bold">Payment</h2>
                <PaymentPill state={state} />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">{t.balance > 0 ? 'Balance due' : 'Fully paid'}</p>
              <p className={cn('text-[32px] font-extrabold leading-tight tabular-nums', t.balance > 0 ? 'text-red-600' : 'text-emerald-600')}>{formatINR(t.balance)}</p>
              <PaidBar paid={t.paid} total={t.total} state={state} className="mt-3 h-2" />
              <div className="mt-2 flex justify-between text-xs text-muted">
                <span>
                  Received <strong className="tabular-nums text-ink">{formatINR(t.paid)}</strong>
                </span>
                <span>
                  of <strong className="tabular-nums text-ink">{formatINR(t.total)}</strong>
                </span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <button type="button" className="btn btn-primary" onClick={() => setPaying(true)} disabled={t.balance <= 0 || cancelled}>
                  <Plus className="h-4 w-4" aria-hidden="true" /> Record payment
                </button>
                {t.balance > 0 && c.phone && !cancelled && (
                  <a href={whatsappLink(c.phone, reminder)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                    <WhatsAppIcon className="h-4 w-4" /> Send reminder
                  </a>
                )}
              </div>
            </div>

            <div className="border-t border-line">
              <h3 className="px-4 pt-4 text-xs font-bold uppercase tracking-wider text-muted sm:px-5">Payments received ({payments.length})</h3>
              {payments.length ? (
                <ul className="divide-y divide-line">
                  {payments.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                        <ReceiptText className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold tabular-nums text-ink">{formatINR(p.amount)}</p>
                        <p className="truncate text-xs text-muted">
                          {formatDay(p.date)} · {p.mode}
                          {p.note && ` · ${p.note}`}
                        </p>
                      </div>
                      <Link to={`/admin/orders/${order.id}/receipt/${p.id}`} className="btn btn-outline btn-sm shrink-0" aria-label={`Receipt ${receiptNo(order, p)}`}>
                        <FileText className="h-3.5 w-3.5" aria-hidden="true" /> Receipt
                      </Link>
                      <button
                        type="button"
                        onClick={() => setRemovingPayment(p)}
                        className="rounded-lg p-2 text-muted transition hover:bg-red-50 hover:text-red-600"
                        aria-label={`Remove payment of ${formatINR(p.amount)} on ${formatDay(p.date)}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 pb-5 pt-2 text-sm text-muted sm:px-5">No payment received yet.</p>
              )}
            </div>
          </section>

          <section className="card p-4 sm:p-5">
            <h2 className="text-base font-bold">Customer</h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-tint text-brand">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{c.company || c.name}</p>
                {c.company && <p className="truncate text-sm text-muted">{c.name}</p>}
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  <a href={telHref(c.phone)} className="text-brand hover:underline">
                    {c.phone}
                  </a>
                </li>
              )}
              {c.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  <a href={`mailto:${c.email}`} className="truncate text-brand hover:underline">
                    {c.email}
                  </a>
                </li>
              )}
              {c.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  <span className="text-ink">{c.address}</span>
                </li>
              )}
              {c.gstin && (
                <li className="flex items-center gap-2.5">
                  <span className="w-4 shrink-0 text-center text-[9px] font-extrabold text-muted" aria-hidden="true">
                    GST
                  </span>
                  <span className="font-mono text-[13px] text-ink">{c.gstin}</span>
                </li>
              )}
              {order.enquiryId && (
                <li className="flex items-center gap-2.5">
                  <Inbox className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  <Link to="/admin/enquiries" className="text-brand hover:underline">
                    From enquiry {order.enquiryId.toUpperCase()}
                  </Link>
                </li>
              )}
            </ul>
          </section>
        </div>
      </div>

      <OrderFormModal open={editing} order={order} onClose={() => setEditing(false)} />
      <PaymentFormModal open={paying} order={order} onClose={() => setPaying(false)} />
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={onDelete}
        title="Delete this order?"
        message={
          <>
            Order <strong className="text-ink">{orderNo(order)}</strong> for {c.company || c.name} and its {payments.length} payment
            {payments.length === 1 ? '' : 's'} will be permanently deleted. To keep the record, set the status to Cancelled instead.
          </>
        }
      />
      <ConfirmDialog
        open={Boolean(removingPayment)}
        onClose={() => setRemovingPayment(null)}
        onConfirm={onRemovePayment}
        title="Remove this payment?"
        confirmLabel="Remove"
        message={
          removingPayment && (
            <>
              The payment of <strong className="text-ink">{formatINR(removingPayment.amount)}</strong> on {formatDay(removingPayment.date)} ({removingPayment.mode}) will be
              removed and the balance due will go up by the same amount.
            </>
          )
        }
      />
    </>
  );
}
