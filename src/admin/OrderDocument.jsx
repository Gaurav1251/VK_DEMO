import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Printer } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { amountInWords, customerLabel, formatDay, formatINR, invoiceNo, lineAmount, orderNo, orderTotals, receiptNo } from '../lib/orders';
import { cn, formatQty } from '../lib/utils';

function Letterhead({ settings, title, meta }) {
  return (
    <header className="flex flex-col gap-6 border-b-2 border-brand pb-5 sm:flex-row sm:items-start sm:justify-between print:flex-row print:items-start print:justify-between">
      <div className="flex items-start gap-4">
        <img src="/images/vk-logo.png" alt="VK India" width={223} height={121} className="h-14 w-auto shrink-0" />
        <div className="text-[12px] leading-relaxed text-muted">
          <p className="text-[15px] font-extrabold text-ink">{settings.companyName || 'VK India Incorporation'}</p>
          <p className="max-w-[280px]">{settings.address}</p>
          <p>
            {[settings.phone1, settings.phone2].filter(Boolean).join(' · ')}
            {settings.salesEmail && <> · {settings.salesEmail}</>}
          </p>
          {settings.gstin && (
            <p className="font-semibold text-ink">
              GSTIN: <span className="font-mono">{settings.gstin}</span>
            </p>
          )}
        </div>
      </div>
      <div className="sm:text-right print:text-right">
        <h1 className="text-[22px] font-extrabold uppercase tracking-[0.08em] text-brand">{title}</h1>
        <dl className="mt-2 grid grid-cols-[auto_auto] justify-start gap-x-4 gap-y-0.5 text-[12px] sm:justify-end print:justify-end">
          {meta.map(([label, value]) => (
            <div key={label} className="contents">
              <dt className="text-muted sm:text-right print:text-right">{label}</dt>
              <dd className="text-right font-bold tabular-nums text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  );
}

function PartyBox({ heading, customer }) {
  return (
    <div className="rounded-lg border border-line p-4 text-[12.5px] leading-relaxed">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">{heading}</p>
      <p className="mt-1 text-[14px] font-bold text-ink">{customerLabel(customer)}</p>
      {customer.company && <p className="text-ink">Attn: {customer.name}</p>}
      {customer.address && <p className="text-muted">{customer.address}</p>}
      {(customer.phone || customer.email) && <p className="text-muted">{[customer.phone, customer.email].filter(Boolean).join(' · ')}</p>}
      {customer.gstin && (
        <p className="font-semibold text-ink">
          GSTIN: <span className="font-mono">{customer.gstin}</span>
        </p>
      )}
    </div>
  );
}

function Signature({ settings }) {
  return (
    <div className="text-right text-[12px]">
      <p className="font-bold text-ink">For {settings.companyName || 'VK India Incorporation'}</p>
      <div className="ml-auto mt-12 w-48 border-t border-ink/40 pt-1.5 text-muted">Authorised signatory</div>
    </div>
  );
}

function Bill({ order, settings }) {
  const t = orderTotals(order);
  const c = order.customer || {};
  const payments = [...(order.payments || [])].sort((a, b) => a.date.localeCompare(b.date));
  const bank = [
    ['Bank', settings.bankName],
    ['A/c no.', settings.bankAccount],
    ['IFSC', settings.bankIfsc],
    ['UPI', settings.upiId],
  ].filter(([, v]) => v);

  return (
    <>
      <Letterhead
        settings={settings}
        title={t.rate > 0 ? 'Tax invoice' : 'Invoice'}
        meta={[
          ['Invoice no.', invoiceNo(order)],
          ['Invoice date', formatDay(order.date)],
          ['Order no.', orderNo(order)],
          ...(order.deliveryDate ? [['Delivery by', formatDay(order.deliveryDate)]] : []),
        ]}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_220px] print:grid-cols-[1fr_220px]">
        <PartyBox heading="Bill to" customer={c} />
        <div className={cn('flex flex-col justify-center rounded-lg p-4 text-center', t.balance > 0 ? 'bg-accent-tint' : 'bg-emerald-50')}>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">{t.balance > 0 ? 'Amount due' : 'Payment status'}</p>
          <p className={cn('mt-1 text-[22px] font-extrabold tabular-nums', t.balance > 0 ? 'text-[#C2410C]' : 'text-emerald-700')}>{t.balance > 0 ? formatINR(t.balance) : 'PAID'}</p>
          {t.balance > 0 && t.paid > 0 && <p className="text-[11px] text-muted">after {formatINR(t.paid)} received</p>}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] text-[12.5px]">
          <thead>
            <tr className="bg-brand text-left text-[10.5px] uppercase tracking-wider text-white">
              <th className="w-9 rounded-l-md px-3 py-2 font-semibold">#</th>
              <th className="px-3 py-2 font-semibold">Description</th>
              <th className="px-3 py-2 text-right font-semibold">Qty</th>
              <th className="px-3 py-2 text-right font-semibold">Rate (₹)</th>
              <th className="rounded-r-md px-3 py-2 text-right font-semibold">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {order.items.map((i, n) => (
              <tr key={i.id || n} className="break-inside-avoid">
                <td className="px-3 py-2.5 text-muted">{n + 1}</td>
                <td className="px-3 py-2.5 font-semibold text-ink">{i.name}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums">
                  {formatQty(i.qty)} {i.unit}
                </td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right tabular-nums">{formatINR(i.rate, { symbol: false })}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-right font-semibold tabular-nums">{formatINR(lineAmount(i), { symbol: false })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 grid gap-6 border-t border-line pt-4 sm:grid-cols-[1fr_280px] print:grid-cols-[1fr_280px]">
        <div className="space-y-4 text-[12px]">
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">Amount in words</p>
            <p className="mt-0.5 font-semibold text-ink">{amountInWords(t.total)}</p>
          </div>
          {bank.length > 0 && (
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">Bank details</p>
              <dl className="mt-1 grid grid-cols-[64px_1fr] gap-y-0.5">
                {bank.map(([k, v]) => (
                  <div key={k} className="contents">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-semibold text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {order.notes && (
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">Notes</p>
              <p className="mt-0.5 whitespace-pre-wrap text-ink">{order.notes}</p>
            </div>
          )}
        </div>

        <dl className="text-[12.5px]">
          {[
            ['Subtotal', formatINR(t.subtotal)],
            t.discount > 0 && [`Discount${order.discount?.type === 'percent' ? ` (${order.discount.value}%)` : ''}`, `− ${formatINR(t.discount)}`],
            t.discount > 0 && t.rate > 0 && ['Taxable value', formatINR(t.taxable)],
            ...(t.rate > 0
              ? order.tax?.interState
                ? [[`IGST @ ${t.rate}%`, formatINR(t.igst)]]
                : [
                    [`CGST @ ${t.rate / 2}%`, formatINR(t.cgst)],
                    [`SGST @ ${t.rate / 2}%`, formatINR(t.sgst)],
                  ]
              : []),
            t.freight > 0 && ['Freight & other charges', formatINR(t.freight)],
            t.roundOff !== 0 && ['Round off', `${t.roundOff > 0 ? '+' : '−'} ${formatINR(Math.abs(t.roundOff))}`],
          ]
            .filter(Boolean)
            .map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-1">
                <dt className="text-muted">{k}</dt>
                <dd className="font-semibold tabular-nums text-ink">{v}</dd>
              </div>
            ))}
          <div className="mt-1.5 flex items-baseline justify-between gap-4 rounded-md bg-brand px-3 py-2.5 text-white">
            <dt className="text-[12px] font-bold uppercase tracking-wider">Grand total</dt>
            <dd className="text-[17px] font-extrabold tabular-nums">{formatINR(t.total)}</dd>
          </div>
          {t.paid > 0 && (
            <>
              <div className="mt-2 flex justify-between gap-4 px-3 py-0.5">
                <dt className="text-muted">Received</dt>
                <dd className="font-semibold tabular-nums text-emerald-700">− {formatINR(t.paid)}</dd>
              </div>
              <div className="flex justify-between gap-4 px-3 py-0.5">
                <dt className="font-bold text-ink">Balance due</dt>
                <dd className="font-extrabold tabular-nums text-ink">{formatINR(t.balance)}</dd>
              </div>
            </>
          )}
        </dl>
      </div>

      {payments.length > 0 && (
        <div className="mt-6 break-inside-avoid">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">Payments received</p>
          <table className="mt-1.5 w-full text-[12px]">
            <tbody className="divide-y divide-line border-y border-line">
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-1.5 pr-3 text-muted">{formatDay(p.date)}</td>
                  <td className="py-1.5 pr-3 font-semibold text-ink">{p.mode}</td>
                  <td className="py-1.5 pr-3 text-muted">{p.note || '—'}</td>
                  <td className="py-1.5 text-right font-semibold tabular-nums text-ink">{formatINR(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 grid break-inside-avoid gap-6 sm:grid-cols-[1fr_auto] print:grid-cols-[1fr_auto]">
        {settings.billTerms ? (
          <div className="text-[11px] leading-relaxed text-muted">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em]">Terms & conditions</p>
            <ol className="mt-1 list-decimal space-y-0.5 pl-4">
              {settings.billTerms
                .split('\n')
                .filter((l) => l.trim())
                .map((l) => (
                  <li key={l}>{l}</li>
                ))}
            </ol>
          </div>
        ) : (
          <span />
        )}
        <Signature settings={settings} />
      </div>
    </>
  );
}

function Receipt({ order, payment, settings }) {
  const t = orderTotals(order);
  const c = order.customer || {};
  const upto = (order.payments || []).filter((p) => p.date < payment.date || (p.date === payment.date && order.payments.indexOf(p) <= order.payments.indexOf(payment)));
  const receivedSoFar = upto.reduce((s, p) => s + Number(p.amount || 0), 0);

  return (
    <>
      <Letterhead
        settings={settings}
        title="Payment receipt"
        meta={[
          ['Receipt no.', receiptNo(order, payment)],
          ['Date', formatDay(payment.date)],
          ['Against invoice', invoiceNo(order)],
        ]}
      />

      <div className="mt-6 rounded-xl border border-line p-5 text-[14px] leading-[1.9] text-ink sm:p-6">
        Received with thanks from <strong>{customerLabel(c)}</strong>
        {c.company && c.name ? <> ({c.name})</> : null} the sum of{' '}
        <strong className="whitespace-nowrap rounded bg-emerald-50 px-1.5 text-emerald-700">{formatINR(payment.amount)}</strong>{' '}
        <span className="text-muted">({amountInWords(payment.amount)})</span> by <strong>{payment.mode}</strong>
        {payment.note && <> — {payment.note}</>}, against invoice <strong>{invoiceNo(order)}</strong> dated {formatDay(order.date)}.
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-3 print:grid-cols-3">
        {[
          ['Invoice total', t.total, 'text-ink'],
          ['Received till date', receivedSoFar, 'text-emerald-700'],
          ['Balance due', Math.max(0, t.total - receivedSoFar), Math.max(0, t.total - receivedSoFar) > 0 ? 'text-[#C2410C]' : 'text-emerald-700'],
        ].map(([label, value, tone]) => (
          <div key={label} className="rounded-lg bg-soft px-4 py-3">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-muted">{label}</p>
            <p className={cn('mt-0.5 text-[18px] font-extrabold tabular-nums', tone)}>{formatINR(value)}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-end justify-between gap-6">
        <p className="text-[11px] text-muted">Subject to realisation of cheque / bank transfer.</p>
        <Signature settings={settings} />
      </div>
    </>
  );
}

/** Printable bill (/admin/orders/:id/bill) and payment receipt (/admin/orders/:id/receipt/:paymentId). Print → "Save as PDF" gives a PDF. */
export default function OrderDocument({ type }) {
  const { id, paymentId } = useParams();
  const { session, orders, settings } = useStore();
  const order = orders.find((o) => o.id === id);
  const payment = type === 'receipt' ? order?.payments?.find((p) => p.id === paymentId) : null;
  const docNo = order && (type === 'receipt' ? payment && receiptNo(order, payment) : invoiceNo(order));

  // The PDF file name comes from the page title
  useEffect(() => {
    if (!docNo) return undefined;
    const previous = document.title;
    document.title = `${docNo} ${customerLabel(order.customer)}`;
    return () => {
      document.title = previous;
    };
  }, [docNo, order]);

  if (!session) return <Navigate to="/admin" replace />;
  if (!order || (type === 'receipt' && !payment)) return <Navigate to={order ? `/admin/orders/${order.id}` : '/admin/orders'} replace />;

  return (
    <div className="min-h-screen bg-soft print:bg-white">
      <div className="sticky top-0 z-10 border-b border-line bg-white/95 backdrop-blur print:hidden">
        <div className="mx-auto flex max-w-[860px] items-center justify-between gap-3 px-4 py-3">
          <Link to={`/admin/orders/${order.id}`} className="btn btn-ghost btn-sm -ml-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> <span className="hidden sm:inline">Back to order</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <p className="hidden items-center gap-2 text-sm font-semibold text-ink sm:flex">
            <FileText className="h-4 w-4 text-muted" aria-hidden="true" /> {docNo}
          </p>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" aria-hidden="true" /> Print / Save PDF
          </button>
        </div>
      </div>

      <article className="print-exact mx-auto my-4 w-full max-w-[860px] bg-white px-4 py-6 shadow-card sm:my-8 sm:rounded-xl sm:px-10 sm:py-10 print:my-0 print:max-w-none print:rounded-none print:p-0 print:shadow-none">
        {type === 'receipt' ? <Receipt order={order} payment={payment} settings={settings} /> : <Bill order={order} settings={settings} />}
        <p className="mt-10 border-t border-line pt-3 text-center text-[11px] text-muted">Thank you for your business · {settings.companyName || 'VK India Incorporation'}</p>
      </article>
    </div>
  );
}
