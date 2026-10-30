import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { CheckCircle2, ClipboardList, Phone, Plus, Send, Trash2, X } from 'lucide-react';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import ConfirmDialog from '../ui/ConfirmDialog';
import { useOverlay } from '../ui/Modal';
import Field from '../ui/Field';
import ProductImage from '../ui/ProductImage';
import EmptyState from '../ui/EmptyState';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { cn, formatQty, isEmail, isPhone, telHref, whatsappLink } from '../../lib/utils';

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', notes: '' };

/** "My Enquiry" — the B2B cart, shown as a centred modal (full screen on mobile). */
export default function EnquiryModal({ open, onClose }) {
  const { cart, products, setCartQty, removeFromCart, clearCart, addEnquiry, categories, settings } = useStore();
  const toast = useToast();
  const panelRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  useOverlay(open, onClose, panelRef);

  useEffect(() => {
    if (!open) {
      setSent(null);
      setErrors({});
      setConfirmClear(false);
    }
  }, [open]);

  if (!open) return null;

  const byId = Object.fromEntries(products.map((p) => [p.id, p]));
  const catName = Object.fromEntries(categories.map((c) => [c.id, c.name]));
  const lines = cart.filter((c) => byId[c.productId]).map((c) => ({ ...c, product: byId[c.productId] }));
  const totalQty = lines.reduce((sum, l) => sum + (Number(l.qty) || 0), 0);
  const wide = !sent && lines.length > 0;

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!form.email.trim()) next.email = 'Please enter your email';
    else if (!isEmail(form.email)) next.email = 'Please enter a valid email address';
    if (!isPhone(form.phone)) next.phone = 'Please enter a valid phone number';
    const badQty = lines.find((l) => !(Number(l.qty) >= 1));
    if (badQty) next.qty = `Enter a quantity of at least 1 for ${badQty.product.name}`;
    setErrors(next);
    if (Object.keys(next).length) {
      const first = panelRef.current?.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }

    const ok = addEnquiry({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      company: form.company.trim(),
      country: '',
      message: form.notes.trim(),
      source: 'My Enquiry',
      items: lines.map((l) => ({ productId: l.productId, name: l.product.name, qty: Number(l.qty) })),
    });
    if (!ok) {
      toast('Could not send your enquiry. Browser storage may be full.', 'error');
      return;
    }
    setSent({ name: form.name.trim().split(' ')[0], count: lines.length, email: form.email.trim() });
    clearCart();
    setForm(EMPTY_FORM);
    toast('Enquiry sent — we will reply within one working day');
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center sm:p-6">
      <div className="fade-in absolute inset-0 bg-brand-deeper/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="my-enquiry-title"
        tabIndex={-1}
        className={cn(
          'pop-in relative flex h-full w-full flex-col overflow-hidden bg-white shadow-float outline-none sm:h-auto sm:max-h-[90vh] sm:rounded-2xl',
          wide ? 'sm:max-w-5xl' : 'sm:max-w-lg',
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-tint text-brand">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 id="my-enquiry-title" className="text-lg font-bold">
                My Enquiry
              </h2>
              <p className="text-xs text-muted">
                {sent ? 'Enquiry sent' : `${lines.length} ${lines.length === 1 ? 'product' : 'products'} selected`}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-muted hover:bg-soft hover:text-ink" aria-label="Close My Enquiry">
            <X className="h-5 w-5" />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-10 text-center sm:px-10">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-xl font-bold">Thank you, {sent.name}!</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Your enquiry for {sent.count} {sent.count === 1 ? 'product' : 'products'} has been sent to our sales team. We will reply to{' '}
              <span className="font-semibold text-ink">{sent.email}</span> with prices and lead times within one working day.
            </p>
            <div className="mt-6 w-full rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-left">
              <p className="text-[13px] font-semibold text-emerald-800">Need it faster?</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <a
                  href={whatsappLink(settings.whatsapp, `Hello VK India, I just sent an enquiry from your website (${sent.email}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp us
                </a>
                <a href={telHref(settings.phone1)} className="btn btn-outline btn-sm">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {settings.phone1}
                </a>
              </div>
            </div>
            <button type="button" className="btn btn-blue mt-6" onClick={onClose} data-autofocus>
              Continue browsing
            </button>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={ClipboardList}
              title="Your enquiry is empty"
              text="Add the products you need and send us one enquiry for all of them. We reply with prices, lead times and samples."
              action={
                <Link to="/products" className="btn btn-primary" onClick={onClose}>
                  Browse products
                </Link>
              }
            />
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="flex min-h-0 flex-1 flex-col">
            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1.1fr_1fr] lg:overflow-hidden">
              {/* Products */}
              <section className="min-w-0 border-line px-5 py-5 sm:px-6 lg:overflow-y-auto lg:border-r" aria-labelledby="my-enquiry-products">
                <div className="flex items-center justify-between gap-3">
                  <h3 id="my-enquiry-products" className="text-[15px] font-bold">
                    Products
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted">Total {formatQty(totalQty)} pcs</span>
                    <span className="h-4 w-px bg-line" aria-hidden="true" />
                    <button
                      type="button"
                      onClick={() => setConfirmClear(true)}
                      className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Clear all
                    </button>
                  </div>
                </div>
                <ul className="mt-3 space-y-3">
                  {lines.map((l) => (
                    <li key={l.productId} className="flex items-center gap-3 rounded-xl border border-line p-2.5">
                      <ProductImage item={l.product} className="h-16 w-16 shrink-0" rounded="rounded-lg" drawingClassName="w-[92%]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-accent">{catName[l.product.categoryId]}</p>
                        <Link to={`/products/${l.productId}`} onClick={onClose} className="line-clamp-2 text-sm font-semibold leading-snug text-ink hover:text-brand">
                          {l.product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            removeFromCart(l.productId);
                            toast(`${l.product.name} removed`, 'info');
                          }}
                          className="-ml-1.5 mt-1 inline-flex items-center gap-1 rounded-md border border-transparent px-1.5 py-0.5 text-xs font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50"
                          aria-label={`Remove ${l.product.name} from My Enquiry`}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Remove
                        </button>
                      </div>
                      <div className="w-[88px] shrink-0 sm:w-[96px]">
                        <label htmlFor={`qty-${l.productId}`} className="mb-1 block text-[11px] font-semibold text-muted">
                          Qty (pcs)
                        </label>
                        <input
                          id={`qty-${l.productId}`}
                          type="number"
                          inputMode="numeric"
                          min="1"
                          step="1"
                          value={l.qty}
                          onChange={(e) => {
                            const v = e.target.value === '' ? '' : Math.max(0, Math.floor(Number(e.target.value)));
                            setCartQty(l.productId, v);
                            if (errors.qty) setErrors((er) => ({ ...er, qty: undefined }));
                          }}
                          className={cn('input px-2.5 py-2 text-right', !(Number(l.qty) >= 1) && errors.qty && 'input-error')}
                          aria-invalid={!(Number(l.qty) >= 1) && errors.qty ? 'true' : undefined}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                {errors.qty && <p className="field-error">{errors.qty}</p>}
                <Link to="/products" onClick={onClose} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add more products
                </Link>
              </section>

              {/* Customer details */}
              <section className="min-w-0 border-t border-line bg-soft/50 px-5 py-5 sm:px-6 lg:overflow-y-auto lg:border-t-0" aria-labelledby="my-enquiry-details">
                <h3 id="my-enquiry-details" className="text-[15px] font-bold">
                  Your details
                </h3>
                <p className="mt-0.5 text-xs text-muted">We only use these to reply to your enquiry.</p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Name" name="d-name" required value={form.name} onChange={update('name')} error={errors.name} autoComplete="name" className="sm:col-span-2" />
                  <Field label="Email" name="d-email" type="email" required value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
                  <Field label="Phone" name="d-phone" type="tel" value={form.phone} onChange={update('phone')} error={errors.phone} autoComplete="tel" placeholder="+91" />
                  <Field label="Company" name="d-company" value={form.company} onChange={update('company')} autoComplete="organization" className="sm:col-span-2" />
                  <Field
                    label="Notes"
                    name="d-notes"
                    as="textarea"
                    rows={3}
                    value={form.notes}
                    onChange={update('notes')}
                    placeholder="Sizes, plating, drawing numbers, delivery location…"
                    className="sm:col-span-2"
                  />
                </div>
              </section>
            </div>
            <div className="flex flex-col gap-2 border-t border-line bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="order-2 text-center text-[11px] text-muted sm:order-1 sm:text-left">Our sales team replies with prices and lead times within one working day.</p>
              <button type="submit" className="btn btn-primary btn-lg order-1 w-full sm:order-2 sm:w-auto">
                <Send className="h-4 w-4" aria-hidden="true" />
                Send enquiry ({lines.length} {lines.length === 1 ? 'product' : 'products'})
              </button>
            </div>
          </form>
        )}
      </div>

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={() => {
          clearCart();
          setConfirmClear(false);
          setErrors({});
          toast('My Enquiry cleared', 'info');
        }}
        title="Clear My Enquiry?"
        confirmLabel="Clear all"
        message={`All ${lines.length} ${lines.length === 1 ? 'product' : 'products'} and their quantities will be removed. Your details in the form are kept.`}
      />
    </div>,
    document.body,
  );
}
