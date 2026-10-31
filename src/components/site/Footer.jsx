import { Link } from 'react-router-dom';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import Logo from '../ui/Logo';
import { NAV } from './Header';
import { useStore } from '../../context/StoreContext';
import { telHref } from '../../lib/utils';

export default function Footer() {
  const { settings, categories } = useStore();
  return (
    <footer className="relative overflow-hidden bg-brand-deeper text-white/70">
      <div className="footer-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div className="container-x relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1.3fr] lg:gap-12 lg:py-16">
        <div data-reveal>
          <Logo light />
          <p className="mt-5 max-w-xs text-sm leading-relaxed">
            Precision brass, copper and steel components machined in Jamnagar since 2006 — for switchgear, plumbing, automotive and
            oil &amp; gas manufacturers in India and abroad.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> ISO 9001 certified
          </p>
        </div>

        <div data-reveal>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Quick links</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Products</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/products?category=${c.id}`} className="hover:text-white">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h3>
          <ul className="mt-4 space-y-3.5 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{settings.address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="flex flex-col">
                <a href={telHref(settings.phone1)} className="hover:text-white">{settings.phone1}</a>
                {settings.phone2 && <a href={telHref(settings.phone2)} className="hover:text-white">{settings.phone2}</a>}
              </span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="flex flex-col">
                <a href={`mailto:${settings.salesEmail}`} className="hover:text-white">{settings.salesEmail}</a>
                {settings.generalEmail && <a href={`mailto:${settings.generalEmail}`} className="hover:text-white">{settings.generalEmail}</a>}
              </span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{settings.hours}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 VK India Incorporation. All rights reserved.</p>
          <p className="text-white/50">Jamnagar · Gujarat · India</p>
        </div>
      </div>
    </footer>
  );
}
