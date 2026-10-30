import { useState } from 'react';
import PartDrawing from '../PartDrawing';
import { cn } from '../../lib/utils';

/**
 * Shows the uploaded photo, or a line drawing on a blueprint grid if there is none
 * (or if the photo fails to load).
 */
export default function ProductImage({ item, className = '', drawingClassName = 'w-[78%]', rounded = 'rounded-xl', fit = 'cover' }) {
  const [failed, setFailed] = useState(false);
  const src = item?.image;

  if (src && !failed) {
    return (
      <div className={cn('overflow-hidden bg-white', rounded, className)}>
        <img
          src={src}
          alt={item.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cn('h-full w-full', fit === 'cover' ? 'object-cover' : 'object-contain')}
        />
      </div>
    );
  }

  return (
    <div className={cn('drawing-bg flex items-center justify-center overflow-hidden', rounded, className)}>
      <PartDrawing style={item?.drawing} className={drawingClassName} title={`Line drawing of ${item?.name || 'part'}`} />
    </div>
  );
}
