import { useEffect, useState } from 'react';
import { IndianRupee } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Field from '../components/ui/Field';
import Select from '../components/ui/Select';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { ORDER_STATUSES, PAYMENT_MODES, formatINR, num, orderNo, orderTotals, today } from '../lib/orders';
import { cn } from '../lib/utils';

export const ORDER_STATUS_STYLES = {
  Confirmed: { pill: 'bg-blue-50 text-blue-700', dot: 'bg-blue-500' },
  'In production': { pill: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  Dispatched: { pill: 'bg-violet-50 text-violet-700', dot: 'bg-violet-500' },
  Delivered: { pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  Cancelled: { pill: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
};

export const PAYMENT_STYLES = {
  Unpaid: { pill: 'bg-red-50 text-red-700', dot: 'bg-red-500', bar: 'bg-red-400' },
  'Partly paid': { pill: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500', bar: 'bg-amber-400' },
  Paid: { pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', bar: 'bg-emerald-500' },
};

function Pill({ styles, children }) {
  return (
    <span className={cn('status-pill whitespace-nowrap', styles.pill)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', styles.dot)} aria-hidden="true" />
      {children}
    </span>
  );
}

export const OrderStatusPill = ({ status }) => <Pill styles={ORDER_STATUS_STYLES[status] || ORDER_STATUS_STYLES.Confirmed}>{status}</Pill>;
export const PaymentPill = ({ state }) => <Pill styles={PAYMENT_STYLES[state] || PAYMENT_STYLES.Unpaid}>{state}</Pill>;

export function OrderStatusSelect({ value, onChange, id, label = 'Order status' }) {
  const s = ORDER_STATUS_STYLES[value] || ORDER_STATUS_STYLES.Confirmed;
  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Select
        id={id}
        variant="pill"
        listLabel="Order status"
        panelMinWidth={180}
        value={value}
        onChange={onChange}
        options={ORDER_STATUSES.map((st) => ({ value: st, label: st, dot: ORDER_STATUS_STYLES[st].dot }))}
        triggerClassName={cn('status-pill cursor-pointer whitespace-nowrap pr-2 hover:ring-2 hover:ring-black/10', s.pill)}
      />
    </>
  );
}

/** Thin bar: how much of the bill has been received. */
export function PaidBar({ paid, total, state, className }) {
  const pct = total > 0 ? Math.min(100, (paid / total) * 100) : 0;
  return (
    <div className={cn('h-1.5 overflow-hidden rounded-full bg-soft ring-1 ring-inset ring-line', className)} aria-hidden="true">
      <div className={cn('h-full rounded-full transition-all duration-500', PAYMENT_STYLES[state]?.bar)} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Record money received against an order (advance, part or final payment). */
export function PaymentFormModal({ order, open, onClose }) {
  const { addPayment } = useStore();
  const toast = useToast();
  const [form, setForm] = useState({ amount: '', date: today(), mode: 'UPI', note: '' });
  const [error, setError] = useState('');
  const totals = order ? orderTotals(order) : null;

  useEffect(() => {
    if (!open || !order) return;
    setForm({ amount: totals.balance ? String(totals.balance) : '', date: today(), mode: 'UPI', note: '' });
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, order?.id]);

  if (!order) return null;

  const submit = (e) => {
    e.preventDefault();
    const amount = num(form.amount);
    if (amount <= 0) return setError('Enter the amount received');
    if (amount > totals.balance + 0.001) return setError(`Only ${formatINR(totals.balance)} is due on this order`);
    if (!addPayment(order.id, { ...form, amount, note: form.note.trim() })) {
      toast('Could not save — browser storage is full', 'error');
      return undefined;
    }
    toast(`${formatINR(amount)} received for ${orderNo(order)}`);
    onClose();
    return undefined;
  };

  const quick = [
    ['Full balance', totals.balance],
    ['Half', Math.round(totals.balance / 2)],
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Record payment"
      subtitle={`${orderNo(order)} · ${order.customer?.company || order.customer?.name}`}
      icon={
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <IndianRupee className="h-5 w-5" aria-hidden="true" />
        </span>
      }
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="payment-form" className="btn btn-primary">
            Save payment
          </button>
        </>
      }
    >
      <div className="grid grid-cols-3 gap-2 rounded-xl bg-soft p-3 text-center">
        {[
          ['Bill total', totals.total, 'text-ink'],
          ['Received', totals.paid, 'text-emerald-700'],
          ['Balance due', totals.balance, 'text-red-600'],
        ].map(([label, value, tone]) => (
          <div key={label}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}</p>
            <p className={cn('mt-0.5 text-[15px] font-extrabold tabular-nums', tone)}>{formatINR(value, { decimals: false })}</p>
          </div>
        ))}
      </div>

      <form id="payment-form" onSubmit={submit} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            label="Amount received (₹)"
            name="pay-amount"
            required
            inputMode="decimal"
            value={form.amount}
            onChange={(e) => (setForm((f) => ({ ...f, amount: e.target.value })), setError(''))}
            error={error}
            data-autofocus
            className="[&_input]:text-lg [&_input]:font-bold"
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {quick.map(([label, value]) => (
              <button
                key={label}
                type="button"
                onClick={() => (setForm((f) => ({ ...f, amount: String(value) })), setError(''))}
                className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-muted transition hover:border-brand hover:text-brand"
              >
                {label} · {formatINR(value, { decimals: false })}
              </button>
            ))}
          </div>
        </div>
        <Field label="Date" name="pay-date" type="date" value={form.date} max={today()} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
        <Field
          label="Paid by"
          name="pay-mode"
          as={Select}
          value={form.mode}
          onChange={(v) => setForm((f) => ({ ...f, mode: v }))}
          options={PAYMENT_MODES.map((m) => ({ value: m, label: m }))}
          listLabel="Payment mode"
        />
        <Field
          label="Reference / note"
          name="pay-note"
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          placeholder="Cheque no., UTR, transaction ID…"
          className="sm:col-span-2"
        />
      </form>
    </Modal>
  );
}
