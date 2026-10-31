import { LayoutGrid } from 'lucide-react';
import Select from '../ui/Select';
import ProductImage from '../ui/ProductImage';

/** Category thumbnail for dropdown rows: the category photo/drawing, or a grid icon for "All". */
export function categoryThumb(category, size = 'h-9 w-9') {
  if (!category) {
    return (
      <span className={`flex items-center justify-center rounded-lg bg-brand-tint text-brand ${size}`}>
        <LayoutGrid className="h-4 w-4" />
      </span>
    );
  }
  return <ProductImage item={category} className={`border border-line ${size}`} rounded="rounded-lg" drawingClassName="w-[115%]" />;
}

/**
 * Category filter for the public products page.
 * `options`: [{ id, name, count, image?, drawing? }] — the first is "All categories" (id "all").
 */
export default function CategorySelect({ options, value, onChange }) {
  return (
    <Select
      size="lg"
      caption="Category"
      listLabel="Product categories"
      searchable={options.length > 6}
      searchPlaceholder="Find a category…"
      value={value}
      onChange={onChange}
      options={options.map((o) => ({ value: o.id, label: o.name, count: o.count, thumb: categoryThumb(o.id === 'all' ? null : o) }))}
    />
  );
}
