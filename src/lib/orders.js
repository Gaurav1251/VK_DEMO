// Order book maths and labels, shared by the admin order pages and the printable bill / receipt.

export const ORDER_STATUSES = ['Confirmed', 'In production', 'Dispatched', 'Delivered', 'Cancelled'];
export const PAYMENT_STATES = ['Unpaid', 'Partly paid', 'Paid'];
export const PAYMENT_MODES = ['Cash', 'UPI', 'Bank transfer', 'Cheque', 'Card'];
export const UNITS = ['pcs', 'kg', 'set', 'box', 'mtr'];
export const GST_RATES = [0, 5, 12, 18, 28];

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
export const num = (v) => {
  const n = parseFloat(String(v ?? '').replace(/,/g, ''));
  return Number.isFinite(n) ? n : 0;
};

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const lineAmount = (item) => round2(num(item.qty) * num(item.rate));

/**
 * Everything a bill needs, from one order:
 * subtotal → discount → taxable value → GST (CGST+SGST within Gujarat, IGST otherwise) → freight → round off → total.
 */
export function orderTotals(order) {
  const subtotal = round2((order.items || []).reduce((s, i) => s + lineAmount(i), 0));
  const d = order.discount || {};
  const discount = round2(Math.min(subtotal, d.type === 'percent' ? (subtotal * num(d.value)) / 100 : num(d.value)));
  const taxable = round2(subtotal - discount);
  const rate = order.tax?.rate ? num(order.tax.rate) : 0;
  const tax = round2((taxable * rate) / 100);
  const igst = order.tax?.interState;
  const freight = round2(num(order.freight));
  const exact = round2(taxable + tax + freight);
  const total = Math.round(exact);
  const paid = round2((order.payments || []).reduce((s, p) => s + num(p.amount), 0));
  return {
    subtotal,
    discount,
    taxable,
    rate,
    tax,
    cgst: igst ? 0 : round2(tax / 2),
    sgst: igst ? 0 : round2(tax - round2(tax / 2)),
    igst: igst ? tax : 0,
    freight,
    roundOff: round2(total - exact),
    total,
    paid,
    balance: round2(Math.max(0, total - paid)),
  };
}

export function paymentState(order, totals = orderTotals(order)) {
  if (totals.paid <= 0) return 'Unpaid';
  return totals.paid >= totals.total ? 'Paid' : 'Partly paid';
}

/** ₹1,23,456.00 — Indian digit grouping. `decimals: false` drops the paise for compact cells. */
export function formatINR(n, { decimals = true, symbol = true } = {}) {
  const s = (Number(n) || 0).toLocaleString('en-IN', {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });
  return symbol ? `₹${s}` : s;
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function under1000(n) {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const rest = r < 20 ? ONES[r] : `${TENS[Math.floor(r / 10)]}${r % 10 ? ` ${ONES[r % 10]}` : ''}`;
  return [h ? `${ONES[h]} Hundred` : '', rest].filter(Boolean).join(' ');
}

/** 245878 → "Rupees Two Lakh Forty Five Thousand Eight Hundred Seventy Eight Only" (Indian system). */
export function amountInWords(amount) {
  const rupees = Math.floor(Math.abs(Number(amount) || 0));
  const paise = Math.round((Math.abs(Number(amount) || 0) - rupees) * 100);
  const parts = [];
  let n = rupees;
  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  if (crore) parts.push(`${crore >= 1000 ? amountInWords(crore).replace(/^Rupees | Only$/g, '') : under1000(crore)} Crore`);
  if (lakh) parts.push(`${under1000(lakh)} Lakh`);
  if (thousand) parts.push(`${under1000(thousand)} Thousand`);
  if (n) parts.push(under1000(n));
  const words = parts.join(' ') || 'Zero';
  return `Rupees ${words}${paise ? ` and ${under1000(paise)} Paise` : ''} Only`;
}

/** Next order number, one higher than any used so far. */
export function nextOrderSeq(orders) {
  return orders.reduce((max, o) => Math.max(max, Number(o.seq) || 0), 0) + 1;
}

export const orderNo = (order) => `VK-${String(order.seq).padStart(4, '0')}`;
export const invoiceNo = (order) => `INV-${String(order.seq).padStart(4, '0')}`;
export const receiptNo = (order, payment) => `RCT-${String(order.seq).padStart(4, '0')}-${(order.payments || []).findIndex((p) => p.id === payment.id) + 1}`;

/** "2026-11-01" → "01 Nov 2026" without timezone drift. */
export function formatDay(day) {
  if (!day) return '—';
  const [y, m, d] = String(day).slice(0, 10).split('-').map(Number);
  if (!y || !m || !d) return '—';
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const customerLabel = (c = {}) => c.company || c.name || 'Customer';
