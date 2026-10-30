import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderTree, Lock, Pencil, Plus, Trash2 } from 'lucide-react';
import { AdminPageHeader } from './AdminLayout';
import ImagePicker from './ImagePicker';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Field from '../components/ui/Field';
import EmptyState from '../components/ui/EmptyState';
import ProductImage from '../components/ui/ProductImage';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';

function CategoryFormModal({ open, category, onClose }) {
  const { categories, saveCategory } = useStore();
  const toast = useToast();
  const [form, setForm] = useState({ name: '', image: '', drawing: 'turned' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setForm(category ? { ...category } : { name: '', image: '', drawing: 'turned' });
    setError('');
  }, [open, category]);

  const submit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return setError('Category name is required');
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase() && c.id !== category?.id)) return setError('A category with this name already exists');
    if (!saveCategory({ ...form, name })) {
      toast('Could not save — browser storage is full. Try a smaller photo.', 'error');
      return undefined;
    }
    toast(category ? `Category “${name}” saved` : `Category “${name}” added`);
    onClose();
    return undefined;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={category ? 'Edit category' : 'Add category'}
      size="lg"
      footer={
        <>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="category-form" className="btn btn-primary">
            {category ? 'Save changes' : 'Add category'}
          </button>
        </>
      }
    >
      <form id="category-form" onSubmit={submit} noValidate className="space-y-5">
        <Field
          label="Category name"
          name="cat-name"
          required
          value={form.name}
          onChange={(e) => {
            setForm((f) => ({ ...f, name: e.target.value }));
            setError('');
          }}
          error={error}
          data-autofocus
        />
        <ImagePicker image={form.image} drawing={form.drawing} name={form.name} onChange={(patch) => setForm((f) => ({ ...f, ...patch }))} />
      </form>
    </Modal>
  );
}

export default function AdminCategories() {
  const { categories, products, deleteCategory } = useStore();
  const toast = useToast();
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const count = (id) => products.filter((p) => p.categoryId === id).length;
  const blocked = deleting && count(deleting.id) > 0;

  const onDelete = () => {
    if (deleteCategory(deleting.id)) toast(`Category “${deleting.name}” deleted`);
    setDeleting(null);
  };

  return (
    <>
      <AdminPageHeader
        title="Categories"
        subtitle={`${categories.length} categories shown in the website’s product filters and footer`}
        actions={
          <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Add category
          </button>
        }
      />

      <div className="card overflow-hidden">
        {categories.length ? (
          <>
          {/* Phones: one row card per category */}
          <ul className="divide-y divide-line md:hidden">
            {categories.map((c) => {
              const n = count(c.id);
              return (
                <li key={c.id} className="flex items-center gap-3 p-4">
                  <ProductImage item={c} className="h-14 w-16 shrink-0 border border-line" rounded="rounded-lg" drawingClassName="w-[95%]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{c.name}</p>
                    <Link to={`/admin/products?category=${c.id}`} className="mt-1 inline-flex rounded-full bg-brand-tint px-2.5 py-0.5 text-xs font-bold text-brand">
                      {n} {n === 1 ? 'product' : 'products'}
                    </Link>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <button type="button" className="btn btn-outline btn-sm px-2.5" onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`}>
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button type="button" className="btn btn-danger btn-sm px-2.5" onClick={() => setDeleting(c)} aria-label={`Delete ${c.name}`}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="relative hidden overflow-x-auto md:block">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-soft text-left text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Products</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {categories.map((c) => {
                  const n = count(c.id);
                  return (
                    <tr key={c.id} className="hover:bg-soft/60">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <ProductImage item={c} className="h-12 w-16 shrink-0 border border-line" rounded="rounded-lg" drawingClassName="w-[95%]" />
                          <span className="font-semibold text-ink">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/admin/products?category=${c.id}`} className="inline-flex rounded-full bg-brand-tint px-2.5 py-1 text-xs font-bold text-brand hover:underline">
                          {n} {n === 1 ? 'product' : 'products'}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`}>
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Edit
                          </button>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => setDeleting(c)} aria-label={`Delete ${c.name}`}>
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </>
        ) : (
          <EmptyState
            icon={FolderTree}
            title="No categories yet"
            text="Categories group your products on the website. Add one to get started."
            action={
              <button type="button" className="btn btn-primary" onClick={() => setEditing('new')}>
                <Plus className="h-4 w-4" aria-hidden="true" /> Add category
              </button>
            }
          />
        )}
      </div>

      <CategoryFormModal open={Boolean(editing)} category={editing === 'new' ? null : editing} onClose={() => setEditing(null)} />

      {blocked ? (
        <Modal
          open
          onClose={() => setDeleting(null)}
          size="sm"
          title="This category can’t be deleted yet"
          icon={
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-tint text-accent">
              <Lock className="h-5 w-5" aria-hidden="true" />
            </span>
          }
          footer={
            <>
              <button type="button" className="btn btn-outline" onClick={() => setDeleting(null)}>
                Close
              </button>
              <Link to={`/admin/products?category=${deleting.id}`} className="btn btn-blue">
                View its products
              </Link>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-muted">
            <strong className="text-ink">{deleting.name}</strong> still has {count(deleting.id)} {count(deleting.id) === 1 ? 'product' : 'products'}. Deleting
            it would leave those products without a category, and they would disappear from the website.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted">Move them to another category (Edit product → Category) or delete them first, then try again.</p>
        </Modal>
      ) : (
        <ConfirmDialog
          open={Boolean(deleting)}
          onClose={() => setDeleting(null)}
          onConfirm={onDelete}
          title="Delete this category?"
          message={
            <>
              <strong className="text-ink">{deleting?.name}</strong> has no products and will be removed from the website’s filters and footer.
            </>
          }
        />
      )}
    </>
  );
}
