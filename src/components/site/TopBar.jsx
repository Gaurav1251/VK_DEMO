import { Mail, MapPin, Phone } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { telHref } from '../../lib/utils';

export default function TopBar() {
  const { settings } = useStore();
  return (
    <div className="bg-brand-dark text-[13px] text-white/80">
      <div className="container-x flex h-10 items-center justify-between gap-4">
        <p className="flex min-w-0 items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
          <span className="hidden truncate md:inline">{settings.address}</span>
          <span className="truncate md:hidden">Jamnagar, Gujarat, India</span>
        </p>
        <div className="flex shrink-0 items-center gap-5">
          <a href={telHref(settings.phone1)} className="flex items-center gap-2 hover:text-white">
            <Phone className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            <span className="hidden min-[400px]:inline">{settings.phone1}</span>
            <span className="min-[400px]:hidden">Call us</span>
          </a>
          <a href={`mailto:${settings.salesEmail}`} className="hidden items-center gap-2 hover:text-white md:flex">
            <Mail className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {settings.salesEmail}
          </a>
        </div>
      </div>
    </div>
  );
}
