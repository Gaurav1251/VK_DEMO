import { cn } from '../../lib/utils';

/**
 * VK India logo with a transparent background.
 * On dark backgrounds (`light`) the navy parts are white so the logo stays readable.
 * `size`: "md" (site header, login, footer) or "sm" (compact admin bars).
 */
export default function Logo({ light = false, tagline = true, size = 'md' }) {
  return (
    <span className="flex items-center gap-3">
      <span className="inline-flex shrink-0 items-center">
        <img
          src={light ? '/images/vk-logo-light.png' : '/images/vk-logo.png'}
          alt="VK India"
          width={223}
          height={121}
          className={cn('w-auto', size === 'sm' ? 'h-8' : 'h-11 lg:h-12')}
        />
      </span>
      {tagline && (
        <span
          className={cn(
            'hidden whitespace-nowrap border-l pl-3 text-[10.5px] font-bold uppercase leading-[1.35] tracking-[0.14em] min-[460px]:block',
            light ? 'border-white/20 text-white/70' : 'border-line text-muted',
          )}
        >
          Manufacturing
          <br />
          Precision Machined Components
        </span>
      )}
    </span>
  );
}
