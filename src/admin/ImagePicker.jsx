import { useRef, useState } from 'react';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import PartDrawing, { DRAWING_STYLES } from '../components/PartDrawing';
import ProductImage from '../components/ui/ProductImage';
import { cn, resizeImage } from '../lib/utils';

/** Photo upload (resized to 640px JPEG) with a line-drawing fallback picker. */
export default function ImagePicker({ image, drawing, name, onChange }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    if (file.size > 15 * 1024 * 1024) {
      setError('That file is larger than 15 MB. Please choose a smaller image.');
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await resizeImage(file, 640, 0.82);
      onChange({ image: dataUrl });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="label">Image</span>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative w-full shrink-0 sm:w-44">
          <ProductImage item={{ image, drawing, name: name || 'Preview' }} className="aspect-[4/3] border border-line" />
          {busy && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80">
              <Loader2 className="h-6 w-6 animate-spin text-brand" aria-label="Processing image" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline-blue btn-sm" onClick={() => inputRef.current?.click()} disabled={busy}>
              <ImagePlus className="h-4 w-4" aria-hidden="true" /> {image ? 'Replace photo' : 'Upload photo'}
            </button>
            {image && (
              <button type="button" className="btn btn-danger btn-sm" onClick={() => onChange({ image: '' })}>
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove photo
              </button>
            )}
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={onFile} tabIndex={-1} aria-hidden="true" />
          <p className="text-xs leading-relaxed text-muted">JPG, PNG or WebP. Resized to 640 px automatically. With no photo, the line drawing below is shown.</p>
          {error && <p className="field-error">{error}</p>}
        </div>
      </div>

      <fieldset className="mt-4">
        <legend className="mb-2 text-xs font-semibold text-muted">Line-drawing style {image && '(used if the photo is removed)'}</legend>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {DRAWING_STYLES.map((s) => (
            <label
              key={s.id}
              className={cn(
                'drawing-bg relative flex cursor-pointer flex-col items-center rounded-lg border-2 p-1 transition focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-1',
                drawing === s.id ? 'border-brand' : 'border-transparent hover:border-brand/30',
              )}
              title={s.label}
            >
              <input type="radio" name="drawing-style" value={s.id} checked={drawing === s.id} onChange={() => onChange({ drawing: s.id })} className="sr-only" />
              <PartDrawing style={s.id} className="w-full" title={s.label} />
              <span className="sr-only">{s.label}</span>
            </label>
          ))}
        </div>
        <p className="mt-1.5 text-xs text-muted">Selected: {DRAWING_STYLES.find((s) => s.id === drawing)?.label || 'None'}</p>
      </fieldset>
    </div>
  );
}
