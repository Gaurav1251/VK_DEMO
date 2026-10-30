import { Link } from 'react-router-dom';
import { Check, Plus } from 'lucide-react';
import ProductImage from '../ui/ProductImage';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/ToastContext';
import { useEnquiryModal } from './enquiryModalContext';
import { defaultQty } from '../../lib/utils';

export function useAddToEnquiry() {
  const { addToCart, cart } = useStore();
  const toast = useToast();
  return {
    inList: (id) => cart.some((c) => c.productId === id),
    add: (product, qty = defaultQty(product)) => {
      const ok = addToCart(product.id, qty);
      if (ok) toast(`${product.name} added to My Enquiry`);
      else toast('Could not save My Enquiry. Browser storage may be full.', 'error');
      return ok;
    },
  };
}

export default function ProductCard({ product, category }) {
  const { inList, add } = useAddToEnquiry();
  const enquiry = useEnquiryModal();
  const added = inList(product.id);
  const url = `/products/${product.id}`;

  return (
    <article className="card-glow product-card group flex flex-col overflow-hidden rounded-2xl border bg-white">
      <Link to={url} className="relative block border-b border-line" tabIndex={-1} aria-hidden="true">
        <ProductImage item={product} rounded="rounded-none" className="aspect-[4/3] transition duration-300 group-hover:brightness-[1.02]" />
        {product.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">Popular</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {category && <p className="text-xs font-bold uppercase tracking-wider text-accent">{category.name}</p>}
        <h3 className="mt-1.5 text-[17px] font-bold leading-snug">
          <Link to={url} className="hover:text-brand">
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted">{product.short}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link to={url} className="btn btn-outline btn-sm py-2">
            View details
          </Link>
          {added ? (
            <button type="button" className="btn btn-added btn-sm py-2" onClick={enquiry.open} title="In My Enquiry — click to view">
              <span className="sr-only">{product.name} is in My Enquiry. View My Enquiry. </span>
              <Check className="h-4 w-4" /> Added
            </button>
          ) : (
            <button type="button" className="btn btn-primary btn-sm py-2" onClick={() => add(product)}>
              <Plus className="h-4 w-4" /> Add to enquiry
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
