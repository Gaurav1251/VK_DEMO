import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import PhotoBackdrop from '../ui/PhotoBackdrop';
import { HERO_TINT } from '../../lib/flags';
import { cn } from '../../lib/utils';

export function Breadcrumb({ items, light = false }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1.5 text-[13px] font-medium ${light ? 'text-white/65' : 'text-muted'}`}>
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.to && !last ? (
                <Link to={item.to} className={light ? 'hover:text-white' : 'hover:text-brand'}>
                  {item.label}
                </Link>
              ) : (
                <span className={last ? (light ? 'text-white' : 'text-ink') : ''} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function PageHeader({ title, subtitle, crumbs, image, imagePosition }) {
  return (
    <section className="hero-bg relative overflow-hidden text-white">
      {image && <PhotoBackdrop src={image} position={imagePosition} tint={HERO_TINT} />}
      <svg className="pointer-events-none absolute -right-10 top-1/2 hidden h-[260px] -translate-y-1/2 opacity-[0.12] md:block" viewBox="0 0 300 200" fill="none" stroke="#fff" strokeWidth="1.5" aria-hidden="true">
        <circle cx="150" cy="100" r="80" />
        <circle cx="150" cy="100" r="40" />
        <circle cx="150" cy="100" r="60" strokeDasharray="4 6" />
        <path d="M40 100h220M150 0v200" strokeDasharray="14 4 3 4" />
      </svg>
      <div className={cn('container-x relative py-12 sm:py-20', image && !HERO_TINT && '[text-shadow:0_1px_12px_rgba(0,0,0,0.55)]')}>
        <Breadcrumb light items={crumbs} />
        <h1 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-[44px] lg:leading-[1.1]">{title}</h1>
        {subtitle && (
          <p className={cn('mt-3 max-w-2xl text-[15px] leading-relaxed sm:text-base', image && !HERO_TINT ? 'text-white/90' : 'text-white/75')}>{subtitle}</p>
        )}
      </div>
    </section>
  );
}
