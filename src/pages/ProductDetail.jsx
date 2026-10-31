import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ClipboardList, EyeOff, Minus, PackageX, Plus, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { Breadcrumb } from '../components/site/PageHeader';
import ProductCard, { useAddToEnquiry } from '../components/site/ProductCard';
import { useEnquiryModal } from '../components/site/enquiryModalContext';
import ProductImage from '../components/ui/ProductImage';
import EmptyState from '../components/ui/EmptyState';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { useStore } from '../context/StoreContext';
import { defaultQty, whatsappLink } from '../lib/utils';

export default function ProductDetail() {
  const { id } = useParams();
  const { products, categories, cart, settings, session } = useStore();
  const { add } = useAddToEnquiry();
  const enquiry = useEnquiryModal();
  const product = products.find((p) => p.id === id);
  const category = categories.find((c) => c.id === product?.categoryId);
  const inList = cart.find((c) => c.productId === id);
  const [qty, setQty] = useState(1000);
  const [qtyError, setQtyError] = useState('');

  useEffect(() => {
    setQty(inList?.qty || defaultQty(product));
    setQtyError('');
    // Reset only when switching product, not on every cart change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Hidden products are only viewable by a logged-in admin (preview).
  if (!product || !category || (!product.active && !session)) {
    return (
      <div className="container-x py-16">
        <div className="rounded-2xl border border-dashed border-line bg-soft">
          <EmptyState
            icon={PackageX}
            title="Product not found"
            text="This product may have been renamed or is no longer listed. Browse our range or tell us what you need."
            action={
              <div className="flex flex-wrap justify-center gap-2.5">
                <Link to="/products" className="btn btn-primary">
                  Browse products
                </Link>
                <Link to="/contact" className="btn btn-outline">
                  Contact us
                </Link>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  const related = products.filter((p) => p.active && p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);
  const specs = [
    ['Material', product.material],
    ['Finish', product.finish],
    ['Sizes', product.sizes],
    ['Minimum order', product.moq],
    ['Custom manufacturing', 'Yes — to your drawing or sample'],
  ].filter(([, v]) => v);

  const changeQty = (value) => {
    setQty(value);
    setQtyError(value === '' || Number(value) < 1 ? 'Enter a quantity of at least 1' : '');
  };

  const onAdd = () => {
    if (!(Number(qty) >= 1)) {
      setQtyError('Enter a quantity of at least 1');
      return;
    }
    add(product, Number(qty));
  };

  return (
    <>
      <div className="border-b border-line bg-soft">
        <div className="container-x flex items-center justify-between gap-4 py-4">
          <Breadcrumb
            items={[
              { label: 'Home', to: '/' },
              { label: 'Products', to: '/products' },
              { label: category.name, to: `/products?category=${category.id}` },
              { label: product.name },
            ]}
          />
          <Link to="/products" className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand hover:underline sm:flex">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All products
          </Link>
        </div>
      </div>

      {!product.active && (
        <div className="border-b border-amber-200 bg-amber-50">
          <p className="container-x flex items-center gap-2 py-2.5 text-sm font-medium text-amber-800">
            <EyeOff className="h-4 w-4" aria-hidden="true" /> Admin preview — this product is hidden from the public website.
          </p>
        </div>
      )}

      <section className="container-x grid gap-8 py-10 sm:py-14 lg:grid-cols-2 lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div data-reveal="zoom" className="relative overflow-hidden rounded-2xl border border-line shadow-card">
            <ProductImage item={product} rounded="rounded-none" className="aspect-[4/3] sm:aspect-square" drawingClassName="w-[84%]" />
            {product.featured && (
              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow">Popular</span>
            )}
          </div>
          <ul className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-semibold text-muted">
            {[
              [ShieldCheck, 'ISO 9001 quality'],
              [Wrench, 'Made to drawing'],
              [Truck, 'Export packing'],
            ].map(([Icon, label]) => (
              <li key={label} className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-white px-2 py-3">
                <Icon className="h-5 w-5 text-brand" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal="right">
          <Link to={`/products?category=${category.id}`} className="text-xs font-bold uppercase tracking-wider text-accent hover:underline">
            {category.name}
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">{product.description || product.short}</p>

          <div className="mt-7 overflow-hidden rounded-2xl border border-line">
            <h2 className="border-b border-line bg-soft px-5 py-3 text-sm font-bold">Specifications</h2>
            <dl className="divide-y divide-line">
              {specs.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[130px_1fr] gap-4 px-5 py-3 text-sm sm:grid-cols-[170px_1fr]">
                  <dt className="font-medium text-muted">{label}</dt>
                  <dd className="font-semibold text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-7 rounded-2xl border border-line bg-white p-5 shadow-card">
            <label htmlFor="detail-qty" className="label">
              Quantity required (pcs)
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex h-12 items-stretch overflow-hidden rounded-[10px] border border-line focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10 sm:w-48">
                <button type="button" className="px-3.5 text-muted hover:bg-soft hover:text-ink" onClick={() => changeQty(Math.max(1, Number(qty || 0) - 100))} aria-label="Decrease quantity by 100">
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  id="detail-qty"
                  type="number"
                  min="1"
                  inputMode="numeric"
                  value={qty}
                  onChange={(e) => changeQty(e.target.value === '' ? '' : Math.max(0, Math.floor(Number(e.target.value))))}
                  className="w-full min-w-0 border-0 text-center text-[15px] font-bold text-ink focus:outline-none"
                  aria-invalid={qtyError ? 'true' : undefined}
                  aria-describedby={qtyError ? 'detail-qty-err' : undefined}
                />
                <button type="button" className="px-3.5 text-muted hover:bg-soft hover:text-ink" onClick={() => changeQty(Number(qty || 0) + 100)} aria-label="Increase quantity by 100">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button type="button" onClick={onAdd} className="btn btn-primary btn-lg h-12 flex-1">
                {inList ? <Check className="h-4 w-4" aria-hidden="true" /> : <ClipboardList className="h-4 w-4" aria-hidden="true" />}
                {inList ? 'Update My Enquiry' : 'Add to My Enquiry'}
              </button>
            </div>
            {qtyError && (
              <p id="detail-qty-err" className="field-error">
                {qtyError}
              </p>
            )}
            <a
              href={whatsappLink(settings.whatsapp, `Hello VK India, I am interested in "${product.name}". Please share price and lead time.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg mt-3 h-12 w-full hover:border-whatsapp hover:text-[#128C4B]"
            >
              <WhatsAppIcon className="h-5 w-5 text-whatsapp" /> Ask on WhatsApp
            </a>
            {inList && (
              <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-emerald-700">
                <Check className="h-4 w-4" aria-hidden="true" /> In My Enquiry ({Number(inList.qty).toLocaleString('en-IN')} pcs) ·{' '}
                <button type="button" className="font-semibold underline" onClick={enquiry.open}>
                  View list
                </button>
              </p>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-soft py-14 sm:py-16">
          <div className="container-x">
            <div data-reveal>
              <p className="eyebrow">More in {category.name}</p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-[28px]">Related products</h2>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
