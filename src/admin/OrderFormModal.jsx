import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, NotebookPen, Plus, Trash2, UserRound } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Field, { Toggle } from '../components/ui/Field';
import Select from '../components/ui/Select';
import ProductImage from '../components/ui/ProductImage';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { GST_RATES, ORDER_STATUSES, PAYMENT_MODES, UNITS, formatINR, lineAmount, num, orderNo, orderTotals, today } from '../lib/orders';
import { cn } from '../lib/utils';

const BLANK_CUSTOMER = { name: '', company: '', phone: '', email: '', gstin: '', address: '' };
const CUSTOM = '__custom';
const lineKey = () => `ln-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const blankLine = () => ({ key: lineKey(), productId: '', name: '', qty: '', unit: 'pcs', rate: '' });
const str = (v) => (v === '' || v == null ? '' : String(v));

function toForm(order, prefill) {
  const src = order || prefill || {};
  return {
    date: src.date || today(),
    deliveryDate: src.deliveryDate || '',
    status: src.status || 'Confirmed',
    customer: { ...BLANK_CUSTOMER, ...src.customer },
    items: src.items?.length
      ? src.items.map((i) => ({ key: i.id || lineKey(), productId: i.productId || (i.name ? CUSTOM : ''), name: i.name, qty: str(i.qty), unit: i.unit || 'pcs', rate: str(i.rate) }))
      : [blankLine()],
    discount: { type: src.discount?.type || 'percent', value: str(src.discount?.value || '') },
    tax: { rate: src.tax?.rate ?? 18, interState: Boolean(src.tax?.interState) },
    freight: str(src.freight || ''),
    notes: src.notes || '',
    enquiryId: src.enquiryId || '',
    advance: { amount: '', mode: 'UPI', note: '' },
  };
}

function toOrder(form) {
  return {
    date: form.date,
    deliveryDate: form.deliveryDate,
    status: form.status,
    customer: Object.fromEntries(Object.entries(form.customer).map(([k, v]) => [k, String(v).trim()])),
    items: form.items.map((i) => ({
      id: i.key,
      productId: i.productId === CUSTOM ? '' : i.productId,
      name: i.name.trim(),
      qty: num(i.qty),
      unit: i.unit,
      rate: num(i.rate),
    })),
    discount: { type: form.discount.type, value: num(form.discount.value) },
    tax: { rate: Number(form.tax.rate) || 0, interState: form.tax.interState },
    freight: num(form.freight),
    notes: form.notes.trim(),
    ...(form.enquiryId ? { enquiryId: form.enquiryId } : {}),
  };
}

function Step({ n, title, hint, children, aside }) {
  return (
    <section className="border-b border-line pb-6 last:border-0 last:pb-0">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{n}</span>
          <div>
            <h3 className="text-[15px] font-bold leading-tight">{title}</h3>
            {hint && <p className="text-xs text-muted">{hint}</p>}
          </div>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}

const moneyInput = 'input text-right tabular-nums';

/**
 * New order / edit order — the digital version of the order notebook.
 * `prefill` (optional) starts a new order from an enquiry: { customer, items, enquiryId }.
 */
export default function OrderFormModal({ open, order, prefill, onClose, onSaved }) {
  const { products, orders, enquiries, saveOrder } = useStore();
  const toast = useToast();
  const [form, setForm] = useState(() => toForm(order, prefill));
  const [errors, setErrors] = useState({});
  const editing = Boolean(order);

  useEffect(() => {
    if (!open) return;
    setForm(toForm(order, prefill));
    setErrors({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, order?.id]);

  const productById = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);
  const productOptions = useMemo(
    () => [
      ...products.map((p) => ({
        value: p.id,
        label: p.name,
        thumb: <ProductImage item={p} className="h-7 w-7 border border-line" rounded="rounded-md" drawingClassName="w-[120%]" />,
      })),
      { value: CUSTOM, label: 'Other item (type a name)', thumb: <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-tint text-accent"><NotebookPen className="h-3.5 w-3.5" /></span> },
    ],
    [products],
  );

  // Customers from earlier orders and enquiries, to fill the details in one click
  const pastCustomers = useMemo(() => {
    const seen = new Map();
    orders.forEach((o) => {
      const k = (o.customer?.company || o.customer?.name || '').toLowerCase();
      if (k && !seen.has(k)) seen.set(k, { ...BLANK_CUSTOMER, ...o.customer });
    });
    enquiries.forEach((e) => {
      const k = (e.company || e.name || '').toLowerCase();
      if (k && !seen.has(k)) seen.set(k, { ...BLANK_CUSTOMER, name: e.name, company: e.company || '', phone: e.phone || '', email: e.email || '', address: e.country && e.country !== 'India' ? e.country : '' });
    });
    return [...seen.entries()].map(([k, c]) => ({ value: k, label: c.company ? `${c.company} · ${c.name}` : c.name, customer: c }));
  }, [orders, enquiries]);

  const draft = useMemo(() => toOrder(form), [form]);
  const totals = orderTotals({ ...draft, payments: editing ? order.payments : [] });
  const advance = editing ? 0 : num(form.advance.amount);

  const clearError = (...keys) => setErrors((er) => (keys.some((k) => er[k]) ? Object.fromEntries(Object.entries(er).filter(([k]) => !keys.includes(k))) : er));
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setCustomer = (key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, customer: { ...f.customer, [key]: value } }));
    clearError(key);
  };
  const setItem = (key, patch) => setForm((f) => ({ ...f, items: f.items.map((i) => (i.key === key ? { ...i, ...patch } : i)) }));

  const pickProduct = (item, productId) => {
    if (productId === CUSTOM) {
      setItem(item.key, { productId, name: item.productId === CUSTOM ? item.name : '' });
      requestAnimationFrame(() => document.getElementById(`f-${item.key}-name`)?.focus());
    } else {
      const p = productById[productId];
      const prevPrice = productById[item.productId]?.price;
      // Fill the rate from the product, unless the user already typed their own
      const keepRate = item.rate !== '' && num(item.rate) !== num(prevPrice);
      setItem(item.key, { productId, name: p.name, rate: keepRate || p.price === '' || p.price == null ? item.rate : String(p.price) });
      if (!item.qty) requestAnimationFrame(() => document.getElementById(`f-${item.key}-qty`)?.focus());
    }
    clearError(`${item.key}-name`, 'items');
  };

  const addLine = () => {
    const line = blankLine();
    setForm((f) => ({ ...f, items: [...f.items, line] }));
    clearError('items');
    requestAnimationFrame(() => document.getElementById(`f-${line.key}-product`)?.focus());
  };

  const validate = () => {
    const next = {};
    if (!form.customer.name.trim()) next.name = 'Customer name is required';
    const used = form.items.filter((i) => i.productId || i.name.trim() || i.qty || i.rate);
    if (!used.length) next.items = 'Add at least one item';
    used.forEach((i) => {
      if (!i.name.trim()) next[`${i.key}-name`] = i.productId === CUSTOM ? 'Type the item name' : 'Choose a product';
      if (num(i.qty) <= 0) next[`${i.key}-qty`] = 'Enter qty';
      if (i.rate === '' || num(i.rate) < 0) next[`${i.key}-rate`] = 'Enter rate';
    });
    if (form.discount.type === 'percent' && num(form.discount.value) > 100) next.discount = 'Discount can’t be more than 100%';
    if (form.discount.type === 'amount' && num(form.discount.value) > totals.subtotal) next.discount = 'Discount is more than the item total';
    if (!editing && advance > totals.total) next.advance = `More than the bill total (${formatINR(totals.total)})`;
    if (editing && totals.paid > totals.total) next.total = `${formatINR(totals.paid)} has already been received — the new total can’t be lower. Remove a payment first.`;
    return { next, used };
  };

  const submit = (e) => {
    e?.preventDefault();
    const { next, used } = validate();
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      const named = { name: 'f-o-name', items: 'add-line', discount: 'f-discount', advance: 'f-o-advance' }[first];
      const target = named || document.getElementById(`f-${first}`) || document.getElementById(`f-${first.replace(/-name$/, '-product')}`);
      (typeof target === 'string' ? document.getElementById(target) : target)?.focus();
      return;
    }
    const record = { ...toOrder({ ...form, items: used }) };
    if (editing) record.id = order.id;
    else record.payments = advance > 0 ? [{ date: form.date, amount: advance, mode: form.advance.mode, note: form.advance.note.trim() || 'Advance' }] : [];
    const id = saveOrder(record);
    if (!id) {
      toast('Could not save — browser storage is full', 'error');
      return;
    }
    toast(editing ? `${orderNo(order)} saved` : `Order saved for ${record.customer.company || record.customer.name}`);
    onSaved?.(id);
    onClose();
  };

  const itemCols = 'md:grid md:grid-cols-[minmax(0,1fr)_92px_92px_112px_118px_36px] md:items-start md:gap-2';

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xl"
      fullScreenMobile
      title={editing ? `Edit order ${orderNo(order)}` : 'New order'}
      subtitle={editing ? order.customer?.company || order.customer?.name : 'Write it down once — the bill and payment record are made from this.'}
      footer={
        <>
          <div className="mr-auto flex min-w-0 flex-col sm:flex-row sm:items-baseline sm:gap-2">
            <span className="text-xs text-muted sm:text-sm">Bill total</span>
            <span className="truncate text-lg font-extrabold leading-tight tabular-nums text-ink sm:text-xl">{formatINR(totals.total)}</span>
          </div>
          <button type="button" className="btn btn-outline hidden sm:inline-flex" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="order-form" className="btn btn-primary">
            {editing ? 'Save changes' : 'Save order'}
          </button>
        </>
      }
    >
      <form id="order-form" onSubmit={submit} noValidate className="space-y-6">
        <Step
          n={1}
          title="Customer"
          hint="Who the order is for"
          aside={
            pastCustomers.length > 0 && (
              <div className="w-full sm:w-64">
                <Select
                  id="o-past-customer"
                  size="sm"
                  aria-label="Fill from a past customer"
                  placeholder="Past customer…"
                  listLabel="Past customers"
                  searchPlaceholder="Find a customer…"
                  searchable
                  panelMinWidth={300}
                  align="right"
                  value=""
                  onChange={(k) => {
                    const c = pastCustomers.find((p) => p.value === k)?.customer;
                    if (c) set({ customer: { ...BLANK_CUSTOMER, ...c } });
                    clearError('name');
                  }}
                  options={pastCustomers.map((p) => ({ value: p.value, label: p.label, thumb: <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-tint text-brand"><UserRound className="h-3.5 w-3.5" /></span> }))}
                />
              </div>
            )
          }
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Contact name" name="o-name" required value={form.customer.name} onChange={setCustomer('name')} error={errors.name} data-autofocus autoComplete="off" />
            <Field label="Company" name="o-company" value={form.customer.company} onChange={setCustomer('company')} autoComplete="off" />
            <Field label="Phone" name="o-phone" type="tel" value={form.customer.phone} onChange={setCustomer('phone')} autoComplete="off" />
            <Field label="Email" name="o-email" type="email" value={form.customer.email} onChange={setCustomer('email')} autoComplete="off" />
            <Field label="GSTIN" name="o-gstin" value={form.customer.gstin} onChange={(e) => setCustomer('gstin')({ target: { value: e.target.value.toUpperCase() } })} placeholder="Optional" autoComplete="off" />
            <Field label="Billing address" name="o-address" value={form.customer.address} onChange={setCustomer('address')} placeholder="Street, city, state" autoComplete="off" />
          </div>
        </Step>

        <Step n={2} title="Order details">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <Field label="Order date" name="o-date" type="date" required value={form.date} onChange={(e) => set({ date: e.target.value })} className="min-w-0" />
            <Field label="Delivery by" name="o-delivery" type="date" value={form.deliveryDate} min={form.date} onChange={(e) => set({ deliveryDate: e.target.value })} className="min-w-0" />
            <Field
              label="Status"
              name="o-status"
              className="col-span-2 sm:col-span-1"
              as={Select}
              value={form.status}
              onChange={(v) => set({ status: v })}
              options={ORDER_STATUSES.map((s) => ({ value: s, label: s }))}
              listLabel="Order status"
            />
          </div>
        </Step>

        <Step n={3} title="Items" hint="Rates fill in from the product price — change them for this order if needed">
          <div className={cn('mb-2 hidden px-1 text-[11px] font-bold uppercase tracking-wider text-muted', itemCols)}>
            <span>Product / item</span>
            <span className="text-right">Qty</span>
            <span>Unit</span>
            <span className="text-right">Rate (₹)</span>
            <span className="text-right">Amount</span>
            <span />
          </div>
          <ol className="space-y-3 md:space-y-2">
            {form.items.map((item, idx) => {
              const err = (k) => errors[`${item.key}-${k}`];
              const custom = item.productId === CUSTOM;
              return (
                <li key={item.key} className={cn('relative rounded-xl border border-line bg-soft/40 p-3 md:border-0 md:bg-transparent md:p-0', itemCols)}>
                  <div className="min-w-0 space-y-2">
                    <label htmlFor={`f-${item.key}-product`} className="label md:sr-only">
                      Item {idx + 1}
                    </label>
                    <Select
                      id={`f-${item.key}-product`}
                      value={item.productId}
                      onChange={(v) => pickProduct(item, v)}
                      options={productOptions}
                      placeholder="Choose a product…"
                      listLabel="Products"
                      searchPlaceholder="Find a product…"
                      panelMinWidth={340}
                      aria-invalid={Boolean(err('name') && !custom)}
                    />
                    {custom && (
                      <input
                        id={`f-${item.key}-name`}
                        value={item.name}
                        onChange={(e) => (setItem(item.key, { name: e.target.value }), clearError(`${item.key}-name`))}
                        placeholder="Item name, size, finish…"
                        aria-label={`Item ${idx + 1} name`}
                        className={cn('input', err('name') && 'input-error')}
                      />
                    )}
                    {err('name') && (
                      <p className="field-error mt-0">
                        <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {err('name')}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 grid grid-cols-3 gap-2 md:contents">
                    <div>
                      <label htmlFor={`f-${item.key}-qty`} className="label md:sr-only">
                        Qty
                      </label>
                      <input
                        id={`f-${item.key}-qty`}
                        inputMode="decimal"
                        value={item.qty}
                        onChange={(e) => (setItem(item.key, { qty: e.target.value }), clearError(`${item.key}-qty`))}
                        placeholder="0"
                        aria-invalid={err('qty') ? 'true' : undefined}
                        className={cn(moneyInput, err('qty') && 'input-error')}
                      />
                    </div>
                    <div>
                      <label htmlFor={`f-${item.key}-unit`} className="label md:sr-only">
                        Unit
                      </label>
                      <Select
                        id={`f-${item.key}-unit`}
                        value={item.unit}
                        onChange={(v) => setItem(item.key, { unit: v })}
                        options={UNITS.map((u) => ({ value: u, label: u }))}
                        listLabel="Unit"
                        panelMinWidth={110}
                      />
                    </div>
                    <div>
                      <label htmlFor={`f-${item.key}-rate`} className="label md:sr-only">
                        Rate (₹)
                      </label>
                      <input
                        id={`f-${item.key}-rate`}
                        inputMode="decimal"
                        value={item.rate}
                        onChange={(e) => (setItem(item.key, { rate: e.target.value }), clearError(`${item.key}-rate`))}
                        placeholder="0.00"
                        aria-invalid={err('rate') ? 'true' : undefined}
                        className={cn(moneyInput, err('rate') && 'input-error')}
                      />
                    </div>
                  </div>
                  {(err('qty') || err('rate')) && (
                    <p className="field-error md:hidden">
                      <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {err('qty') || err('rate')}
                    </p>
                  )}

                  <div className="mt-2.5 flex items-center justify-between md:contents">
                    <p className="text-sm md:flex md:h-11 md:items-center md:justify-end">
                      <span className="mr-2 text-muted md:hidden">Amount</span>
                      <span className="font-bold tabular-nums text-ink">{formatINR(lineAmount(draft.items[idx]))}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, items: f.items.length > 1 ? f.items.filter((i) => i.key !== item.key) : [blankLine()] }))}
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted transition hover:bg-red-50 hover:text-red-600 md:h-11"
                      aria-label={`Remove item ${idx + 1}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
          <button id="add-line" type="button" onClick={addLine} className="btn btn-outline-blue btn-sm mt-3">
            <Plus className="h-4 w-4" aria-hidden="true" /> Add item
          </button>
          {errors.items && (
            <p className="field-error">
              <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {errors.items}
            </p>
          )}
        </Step>

        <Step n={4} title="Discount, GST & payment">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="grid content-start gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="f-discount" className="label">
                  Discount
                </label>
                <div className="flex gap-2">
                  <input
                    id="f-discount"
                    inputMode="decimal"
                    value={form.discount.value}
                    onChange={(e) => (set({ discount: { ...form.discount, value: e.target.value } }), clearError('discount'))}
                    placeholder="0"
                    aria-invalid={errors.discount ? 'true' : undefined}
                    className={cn(moneyInput, 'min-w-0 flex-1', errors.discount && 'input-error')}
                  />
                  <div className="flex shrink-0 rounded-[10px] border border-line bg-soft p-1" role="group" aria-label="Discount type">
                    {[
                      ['percent', '%'],
                      ['amount', '₹'],
                    ].map(([type, sym]) => (
                      <button
                        key={type}
                        type="button"
                        aria-pressed={form.discount.type === type}
                        onClick={() => (set({ discount: { ...form.discount, type } }), clearError('discount'))}
                        className={cn(
                          'w-9 rounded-md text-sm font-bold transition',
                          form.discount.type === type ? 'bg-white text-brand shadow-sm ring-1 ring-line' : 'text-muted hover:text-ink',
                        )}
                      >
                        {sym}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.discount && (
                  <p className="field-error">
                    <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" /> {errors.discount}
                  </p>
                )}
              </div>
              <Field
                label="GST"
                name="o-gst"
                as={Select}
                value={form.tax.rate}
                onChange={(v) => set({ tax: { ...form.tax, rate: v } })}
                options={GST_RATES.map((r) => ({ value: r, label: r ? `GST ${r}%` : 'No GST' }))}
                listLabel="GST rate"
              />
              <Field label="Freight & other charges (₹)" name="o-freight" inputMode="decimal" value={form.freight} onChange={(e) => set({ freight: e.target.value })} placeholder="0" className="[&_input]:text-right" />
              {Number(form.tax.rate) > 0 ? (
                <div className="sm:pt-[26px]">
                  <Toggle
                    checked={form.tax.interState}
                    onChange={(v) => set({ tax: { ...form.tax, interState: v } })}
                    label="Customer outside Gujarat"
                    description="Charge IGST instead of CGST + SGST"
                  />
                </div>
              ) : (
                <span className="hidden sm:block" />
              )}

              {!editing && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 sm:col-span-2">
                  <p className="text-sm font-bold text-ink">Payment received with the order</p>
                  <p className="text-xs text-muted">Advance or full payment. Leave empty if nothing is received yet — you can add payments later.</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-[1fr_150px_1fr]">
                    <Field
                      label="Amount (₹)"
                      name="o-advance"
                      inputMode="decimal"
                      value={form.advance.amount}
                      onChange={(e) => (set({ advance: { ...form.advance, amount: e.target.value } }), clearError('advance'))}
                      placeholder="0"
                      error={errors.advance}
                    />
                    <Field
                      label="Paid by"
                      name="o-advance-mode"
                      as={Select}
                      value={form.advance.mode}
                      onChange={(v) => set({ advance: { ...form.advance, mode: v } })}
                      options={PAYMENT_MODES.map((m) => ({ value: m, label: m }))}
                      listLabel="Payment mode"
                    />
                    <Field
                      label="Reference"
                      name="o-advance-note"
                      value={form.advance.note}
                      onChange={(e) => set({ advance: { ...form.advance, note: e.target.value } })}
                      placeholder="UTR / cheque no."
                      className="col-span-2 sm:col-span-1"
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
                    onClick={() => (set({ advance: { ...form.advance, amount: String(totals.total) } }), clearError('advance'))}
                  >
                    Paid in full ({formatINR(totals.total, { decimals: false })})
                  </button>
                </div>
              )}
              <Field label="Notes" name="o-notes" as="textarea" rows={2} value={form.notes} onChange={(e) => set({ notes: e.target.value })} placeholder="Plating, packing, drawing revision, transport…" className="sm:col-span-2" />
            </div>

            <aside className="h-fit rounded-2xl border border-line bg-soft/60 p-4 lg:sticky lg:top-0" aria-label="Bill summary">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">Bill summary</p>
              <dl className="mt-3 space-y-2 text-sm">
                <SumRow label={`Items (${draft.items.filter((i) => i.name).length})`} value={totals.subtotal} />
                {totals.discount > 0 && <SumRow label={`Discount${form.discount.type === 'percent' ? ` (${num(form.discount.value)}%)` : ''}`} value={-totals.discount} tone="text-emerald-700" />}
                {totals.discount > 0 && <SumRow label="Taxable value" value={totals.taxable} />}
                {totals.rate > 0 &&
                  (form.tax.interState ? (
                    <SumRow label={`IGST ${totals.rate}%`} value={totals.igst} />
                  ) : (
                    <>
                      <SumRow label={`CGST ${totals.rate / 2}%`} value={totals.cgst} />
                      <SumRow label={`SGST ${totals.rate / 2}%`} value={totals.sgst} />
                    </>
                  ))}
                {totals.freight > 0 && <SumRow label="Freight & other" value={totals.freight} />}
                {totals.roundOff !== 0 && <SumRow label="Round off" value={totals.roundOff} muted />}
              </dl>
              <div className="mt-3 flex items-baseline justify-between border-t border-dashed border-line pt-3">
                <span className="text-sm font-bold text-ink">Total</span>
                <span className="text-2xl font-extrabold tabular-nums text-ink">{formatINR(totals.total)}</span>
              </div>
              {(advance > 0 || (editing && totals.paid > 0)) && (
                <dl className="mt-3 space-y-1.5 rounded-xl bg-white p-3 text-sm ring-1 ring-line">
                  <SumRow label="Received" value={editing ? totals.paid : advance} tone="text-emerald-700" />
                  <SumRow label="Balance due" value={Math.max(0, totals.total - (editing ? totals.paid : advance))} tone="font-bold text-red-600" />
                </dl>
              )}
              {errors.total && (
                <p className="field-error" role="alert">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> {errors.total}
                </p>
              )}
            </aside>
          </div>
        </Step>
      </form>
    </Modal>
  );
}

function SumRow({ label, value, tone = 'text-ink', muted }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className={cn('font-semibold tabular-nums', muted ? 'text-muted' : tone)}>{value < 0 ? `− ${formatINR(-value)}` : formatINR(value)}</dd>
    </div>
  );
}
