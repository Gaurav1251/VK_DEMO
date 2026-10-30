import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ClipboardList, Menu, Phone, X } from 'lucide-react';
import Logo from '../ui/Logo';
import { useStore } from '../../context/StoreContext';
import { cn, telHref } from '../../lib/utils';

export const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/quality', label: 'Quality' },
  { to: '/contact', label: 'Contact' },
];

function useBounceOnIncrease(value) {
  const prev = useRef(value);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (value > prev.current) setTick((t) => t + 1);
    prev.current = value;
  }, [value]);
  return tick;
}

export default function Header({ onOpenEnquiry }) {
  const { cart, settings } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const count = cart.length;
  const bounce = useBounceOnIncrease(count);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header className={cn('sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow', scrolled ? 'border-line shadow-card' : 'border-transparent')}>
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Link to="/" className="rounded-lg" aria-label="VK India home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'relative rounded-lg px-3.5 py-2 text-[15px] font-semibold transition',
                  isActive
                    ? 'text-brand after:absolute after:inset-x-3.5 after:-bottom-[15px] after:h-[3px] after:rounded-full after:bg-accent'
                    : 'text-ink/75 hover:bg-soft hover:text-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpenEnquiry} className="btn btn-blue relative pl-4 pr-4 sm:pr-5" aria-label={`Open My Enquiry, ${count} ${count === 1 ? 'product' : 'products'}`}>
            <ClipboardList className="h-[18px] w-[18px]" aria-hidden="true" />
            <span className="hidden sm:inline">My Enquiry</span>
            <span
              key={bounce}
              className={cn(
                'absolute -right-2 -top-2 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white bg-accent px-1 text-[11px] font-bold text-white',
                bounce > 0 && 'animate-badge',
              )}
              aria-hidden="true"
            >
              {count}
            </span>
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-ink hover:bg-soft lg:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div id="mobile-menu" className="fade-in border-t border-line bg-white lg:hidden">
          <nav className="container-x flex flex-col py-3" aria-label="Mobile">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn('rounded-xl px-3 py-3 text-base font-semibold', isActive ? 'bg-brand-tint text-brand' : 'text-ink hover:bg-soft')
                }
              >
                {item.label}
              </NavLink>
            ))}
            <a href={telHref(settings.phone1)} className="btn btn-primary mt-3 w-full">
              <Phone className="h-4 w-4" /> Call {settings.phone1}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
