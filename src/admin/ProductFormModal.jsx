import { useEffect, useState } from 'react';
import Modal from '../components/ui/Modal';
import Field, { Toggle } from '../components/ui/Field';
import Select from '../components/ui/Select';
import { categoryThumb } from '../components/site/CategorySelect';
import ImagePicker from './ImagePicker';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';

const BLANK = {
  name: '',
  categoryId: '',
  short: '',
  description: '',
  material: 'Brass CW614N / IS 319',
  finish: 'Natural, nickel or tin plated',
  sizes: '',
  moq: '1,000 pcs',
  image: '',
  drawing: 'turned',
  featured: false,
  active: true,
};

export default function ProductFormModal({ open, product, onClose }) {
  const { categories, products, saveProduct } = useStore();
  const toast = useToast();
  const [form, setForm] = useState(BLANK);
  const [errors, setErrors] = useState({});
  const editing = Boolean(product);

  useEffect(() => {
    if (!open) return;
    setForm(product ? { ...BLANK, ...product } : { ...BLANK, categoryId: categories[0]?.id || '' });
    setErrors({});
  }, [open, product, categories]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const bind = (key) => ({
    value: form[key] ?? '',
    onChange: (e) => {
      set({ [key]: e.target.value });
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
  });

  const submit = (e) => {
    e?.preventDefault();
    const next = {};
    const name = form.name.trim();
    if (!name) next.name = 'Product name is required';
    else if (products.some((p) => p.name.toLowerCase() === name.toLowerCase() && p.id !== product?.id)) next.name = 'A product with this name already exists';
    if (!form.categoryId) next.categoryId = 'Choose a category';
    if (!form.short.trim()) next.short = 'Short description is required';
    else if (form.short.trim().length > 160) next.short = `Keep it under 160 characters (now ${form.short.trim().length})`;
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`f-p-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, typeof v === 'string' && k !== 'image' ? v.trim() : v]));
    const ok = saveProduct(clean);
    if (!ok) {
      toast('Could not save — browser storage is full. Try a smaller photo or remove unused photos.', 'error');
      return;
    }
    toast(editing ? `“${name}” saved` : `“${name}” added to products`);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={editing ? 'Edit product' : 'Add product'}
      subtitle={editing ? product.name : 'New products appear on the website straight away if visible.'}
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="product-form" className="btn btn-primary">
            {editing ? 'Save changes' : 'Add product'}
          </button>
        </>
      }
    >
      <form id="product-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name" name="p-name" required {...bind('name')} error={errors.name} className="sm:col-span-2" data-autofocus />
        <Field
          label="Category"
          name="p-categoryId"
          as={Select}
          required
          value={form.categoryId}
          onChange={(v) => bind('categoryId').onChange({ target: { value: v } })}
          options={categories.map((c) => ({ value: c.id, label: c.name, thumb: categoryThumb(c, 'h-7 w-7') }))}
          placeholder="Choose a category…"
          listLabel="Categories"
          searchPlaceholder="Find a category…"
          error={errors.categoryId}
          className="sm:col-span-2"
        />
        <Field
          label="Short description"
          name="p-short"
          required
          {...bind('short')}
          error={errors.short}
          hint={`Shown on product cards · ${form.short.length}/160`}
          className="sm:col-span-2"
        />
        <Field label="Full description" name="p-description" as="textarea" rows={4} {...bind('description')} className="sm:col-span-2" hint="Shown on the product detail page." />
        <Field label="Material" name="p-material" {...bind('material')} placeholder="Brass CW614N / IS 319" />
        <Field label="Finish" name="p-finish" {...bind('finish')} placeholder="Natural, nickel or tin plated" />
        <Field label="Sizes" name="p-sizes" {...bind('sizes')} placeholder="4 to 26 way" />
        <Field label="Minimum order" name="p-moq" {...bind('moq')} placeholder="1,000 pcs" />
        <div className="sm:col-span-2">
          <ImagePicker image={form.image} drawing={form.drawing} name={form.name} onChange={set} />
        </div>
        <Toggle checked={form.featured} onChange={(v) => set({ featured: v })} label="Show in popular products" description="Featured on the home page with a Popular badge" />
        <Toggle checked={form.active} onChange={(v) => set({ active: v })} label="Visible on website" description="Turn off to hide without deleting" />
      </form>
    </Modal>
  );
}
