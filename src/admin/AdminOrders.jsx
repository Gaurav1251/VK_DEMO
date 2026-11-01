import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ClipboardList, Download, Eye, IndianRupee, Plus, Printer, ReceiptText, Search, Wallet } from 'lucide-react';
import { AdminPageHeader } from './AdminLayout';
import OrderFormModal from './OrderFormModal';
import { OrderStatusSelect, PaidBar, PaymentPill, PAYMENT_STYLES } from './orderParts';
import EmptyState from '../components/ui/EmptyState';
import Pagination, { usePagination } from '../components/ui/Pagination';
import Select from '../components/ui/Select';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { ORDER_STATUSES, PAYMENT_STATES, formatDay, formatINR, orderNo, orderTotals, paymentState } from '../lib/orders';
import { cn, downloadText, formatQty, toCsv } from '../lib/utils';

const itemsText = (o) => (o.items || []).map((i) => `${i.name} × ${formatQty(i.qty)}`).join(', ');

function SummaryCard({ icon: Icon, label, value, note, tone }) {
  return (
    <div className="card flex min-w-0 items-center gap-4 p-3.5 sm:p-5">
      <span className={cn('hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:flex', tone)}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-muted">{label}</p>
        <p className="truncate text-xl font-extrabold leading-tight tabular-nums text-ink sm:text-[22px]">{value}</p>
        {note && <p className="truncate text-xs text-muted">{note}</p>}
      </div>
    </div>
  );
}

export function enquiryToPrefill(enquiry, products) {
  if (!enquiry) return null;
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  return {
    enquiryId: enquiry.id,
    customer: {
      name: enquiry.name,
      company: enquiry.company || '',
      phone: enquiry.phone || '',
      email: enquiry.email || '',
      address: enquiry.country && enquiry.country !== 'India' ? enquiry.country : '',
    },
    items: (enquiry.items || []).map((i) => ({ productId: byId[i.productId] ? i.productId : '', name: i.name, qty: i.qty, unit: 'pcs', rate: byId[i.productId]?.price ?? '' })),
  };
}

export default function AdminOrders() {
  const { orders, enquiries, products, setOrderStatus } = useStore();
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const pay = PAYMENT_STATES.includes(params.get('pay')) ? params.get('pay') : 'All';
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [form, setForm] = useState(null); // null | { prefill }

  // "+ New order" from elsewhere (dashboard, an enquiry) lands here with ?new=1[&from=enquiryId]
  useEffect(() => {
    if (!params.get('new')) return;
    const from = enquiries.find((e) => e.id === params.get('from'));
    setForm({ prefill: enquiryToPrefill(from, products) });
    const next = new URLSearchParams(params);
    next.delete('new');
    next.delete('from');
    setParams(next, { replace: true });
  }, [params, setParams, enquiries, products]);

  const enriched = useMemo(
    () =>
      [...orders]
        .sort((a, b) => b.date.localeCompare(a.date) || b.seq - a.seq)
        .map((o) => {
          const totals = orderTotals(o);
          return { ...o, totals, payState: paymentState(o, totals) };
        }),
    [orders],
  );
  const live = enriched.filter((o) => o.status !== 'Cancelled');
  const sum = (list, key) => list.reduce((s, o) => s + o.totals[key], 0);
  const payCounts = Object.fromEntries(PAYMENT_STATES.map((s) => [s, live.filter((o) => o.payState === s).length]));

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enriched.filter(
      (o) =>
        (pay === 'All' || (o.payState === pay && o.status !== 'Cancelled')) &&
        (status === 'all' || o.status === status) &&
        (!q || `${orderNo(o)} ${o.customer?.name} ${o.customer?.company} ${o.customer?.phone} ${itemsText(o)}`.toLowerCase().includes(q)),
    );
  }, [enriched, pay, status, query]);
  const pager = usePagination(rows, 10, `${pay}|${status}|${query}`);

  const changeStatus = (o, s) => {
    if (setOrderStatus(o.id, s)) toast(`${orderNo(o)} marked as ${s}`);
  };

  const exportCsv = () => {
    const header = ['Order no', 'Order date', 'Delivery by', 'Customer', 'Company', 'Phone', 'GSTIN', 'Items', 'Bill total', 'Received', 'Balance', 'Payment', 'Status', 'Notes'];
    const data = rows.map((o) => [
      orderNo(o),
      formatDay(o.date),
      o.deliveryDate ? formatDay(o.deliveryDate) : '',
      o.customer?.name,
      o.customer?.company,
      o.customer?.phone,
      o.customer?.gstin,
      itemsText(o),
      o.totals.total,
      o.totals.paid,
      o.totals.balance,
      o.payState,
      o.status,
      o.notes,
    ]);
    const name = `vk-india-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    if (downloadText(name, toCsv([header, ...data]))) toast(`Downloaded ${name}`);
    else toast('Download failed', 'error');
  };

  const clearFilters = () => {
    setQuery('');
    setStatus('all');
    setParams({}, { replace: true });
  };

  const actions = (o, cls = '') => (
    <div className={cn('flex gap-1.5', cls)}>
      <Link to={`/admin/orders/${o.id}`} className="btn btn-outline btn-sm" aria-label={`Open order ${orderNo(o)}`}>
        <Eye className="h-3.5 w-3.5" aria-hidden="true" /> Open
      </Link>
      <Link to={`/admin/orders/${o.id}/bill`} className="btn btn-outline btn-sm" aria-label={`Bill for ${orderNo(o)}`}>
        <Printer className="h-3.5 w-3.5" aria-hidden="true" /> Bill
      </Link>
    </div>
  );

  return (
    <>
      <AdminPageHeader
        title="Orders"
        subtitle="Your order book — every order, payment received and balance in one place"
        actions={
          <>
            <button type="button" className="btn btn-outline" onClick={exportCsv} disabled={!rows.length}>
              <Download className="h-4 w-4" aria-hidden="true" /> Export CSV
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setForm({ prefill: null })}>
              <Plus className="h-4 w-4" aria-hidden="true" /> New order
            </button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <SummaryCard icon={ClipboardList} label="Orders" value={live.length} note={`${payCounts.Unpaid + payCounts['Partly paid']} awaiting payment`} tone="bg-brand-tint text-brand" />
        <SummaryCard icon={ReceiptText} label="Total billed" value={formatINR(sum(live, 'total'), { decimals: false })} note="Excluding cancelled" tone="bg-violet-50 text-violet-600" />
        <SummaryCard icon={Wallet} label="Received" value={formatINR(sum(live, 'paid'), { decimals: false })} note="Payments recorded" tone="bg-emerald-50 text-emerald-600" />
        <SummaryCard icon={IndianRupee} label="Balance due" value={formatINR(sum(live, 'balance'), { decimals: false })} note="Still to be collected" tone="bg-red-50 text-red-600" />
      </div>

      <div className="no-scrollbar -mx-4 mb-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label="Filter by payment">
        {['All', ...PAYMENT_STATES].map((s) => {
          const active = s === pay;
          const n = s === 'All' ? enriched.length : payCounts[s];
          return (
            <button
              key={s}
              type="button"
              aria-pressed={active}
              onClick={() => setParams(s === 'All' ? {} : { pay: s }, { replace: true })}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition',
                active ? 'bg-white text-brand shadow-card ring-1 ring-line' : 'text-muted hover:bg-white/70 hover:text-ink',
              )}
            >
              {s !== 'All' && <span className={cn('h-2 w-2 rounded-full', PAYMENT_STYLES[s].dot)} aria-hidden="true" />}
              {s}
              <span className={cn('rounded-full px-2 py-px text-[11px] font-bold', active ? 'bg-brand text-white' : 'bg-line text-muted')}>{n}</span>
            </button>
          );
        })}
      </div>

      <div data-paginated className="card scroll-mt-20 overflow-hidden lg:scroll-mt-6">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <input id="order-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order no., customer, phone or item…" className="input pl-10" />
          </div>
          <div className="sm:w-56">
            <Select
              id="order-status-filter"
              aria-label="Filter by order status"
              listLabel="Order status"
              align="right"
              value={status}
              onChange={setStatus}
              options={[
                { value: 'all', label: 'All statuses', count: enriched.length },
                ...ORDER_STATUSES.map((s) => ({ value: s, label: s, count: enriched.filter((o) => o.status === s).length })),
              ]}
            />
          </div>
        </div>

        {rows.length ? (
          <>
            {/* Phones: one card per order */}
            <ul className="divide-y divide-line md:hidden">
              {pager.items.map((o) => (
                <li key={o.id} className={cn('p-4', o.status === 'Cancelled' && 'opacity-60')}>
                  <div className="flex items-start justify-between gap-3">
                    <Link to={`/admin/orders/${o.id}`} className="min-w-0">
                      <p className="text-xs font-bold text-brand">
                        {orderNo(o)} <span className="font-medium text-muted">· {formatDay(o.date)}</span>
                      </p>
                      <p className="mt-0.5 truncate font-semibold text-ink">{o.customer?.company || o.customer?.name}</p>
                      {o.customer?.company && <p className="truncate text-xs text-muted">{o.customer.name}</p>}
                    </Link>
                    <div className="shrink-0">
                      <OrderStatusSelect id={`m-ostatus-${o.id}`} label={`Status of ${orderNo(o)}`} value={o.status} onChange={(s) => changeStatus(o, s)} />
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[13px] text-muted">{itemsText(o)}</p>
                  <div className="mt-3 rounded-xl bg-soft p-3">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-extrabold tabular-nums text-ink">{formatINR(o.totals.total, { decimals: false })}</span>
                      <PaymentPill state={o.payState} />
                    </div>
                    <PaidBar paid={o.totals.paid} total={o.totals.total} state={o.payState} className="mt-2" />
                    <p className="mt-1.5 flex justify-between text-xs text-muted">
                      <span>Received {formatINR(o.totals.paid, { decimals: false })}</span>
                      {o.totals.balance > 0 && <span className="font-semibold text-red-600">Due {formatINR(o.totals.balance, { decimals: false })}</span>}
                    </p>
                  </div>
                  {actions(o, 'mt-3 grid grid-cols-2')}
                </li>
              ))}
            </ul>

            <div className="relative hidden overflow-x-auto md:block">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="bg-soft text-left text-xs uppercase tracking-wider text-muted">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Order</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Items</th>
                    <th className="px-4 py-3 text-right font-semibold">Bill total</th>
                    <th className="w-[190px] px-4 py-3 font-semibold">Payment</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {pager.items.map((o) => (
                    <tr
                      key={o.id}
                      onClick={() => navigate(`/admin/orders/${o.id}`)}
                      className={cn('cursor-pointer align-top transition hover:bg-brand-tint/40', o.status === 'Cancelled' && 'opacity-60')}
                    >
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <p className="font-bold text-brand">{orderNo(o)}</p>
                        <p className="text-xs text-muted">{formatDay(o.date)}</p>
                      </td>
                      <td className="max-w-[200px] px-4 py-3.5">
                        <p className="truncate font-semibold text-ink">{o.customer?.company || o.customer?.name}</p>
                        <p className="truncate text-xs text-muted">{o.customer?.company ? o.customer.name : o.customer?.phone || '—'}</p>
                      </td>
                      <td className="max-w-[240px] px-4 py-3.5">
                        <p className="line-clamp-2 text-muted">{itemsText(o)}</p>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-right font-bold tabular-nums text-ink">{formatINR(o.totals.total, { decimals: false })}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-between gap-2">
                          <PaymentPill state={o.payState} />
                          {o.totals.balance > 0 && <span className="text-xs font-semibold tabular-nums text-red-600">Due {formatINR(o.totals.balance, { decimals: false })}</span>}
                        </div>
                        <PaidBar paid={o.totals.paid} total={o.totals.total} state={o.payState} className="mt-2" />
                      </td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <OrderStatusSelect id={`ostatus-${o.id}`} label={`Status of ${orderNo(o)}`} value={o.status} onChange={(s) => changeStatus(o, s)} />
                      </td>
                      <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        {actions(o, 'justify-end')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pager={pager} label="orders" />
          </>
        ) : (
          <EmptyState
            icon={ClipboardList}
            title={orders.length ? 'No orders match your filters' : 'No orders yet'}
            text={orders.length ? 'Try a different search, payment or status filter.' : 'Write down your first order — the bill and payment record are made from it.'}
            action={
              orders.length ? (
                <button type="button" className="btn btn-outline" onClick={clearFilters}>
                  Clear filters
                </button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={() => setForm({ prefill: null })}>
                  <Plus className="h-4 w-4" aria-hidden="true" /> New order
                </button>
              )
            }
          />
        )}
      </div>

      <OrderFormModal
        open={Boolean(form)}
        prefill={form?.prefill}
        onClose={() => setForm(null)}
        onSaved={(id) => navigate(`/admin/orders/${id}`)}
      />
    </>
  );
}
