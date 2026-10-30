import WhatsAppIcon from '../ui/WhatsAppIcon';
import { useStore } from '../../context/StoreContext';
import { whatsappLink } from '../../lib/utils';

export default function WhatsAppFloat() {
  const { settings } = useStore();
  return (
    <a
      href={whatsappLink(settings.whatsapp, 'Hello VK India, I would like to enquire about your brass components.')}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.65)] transition hover:scale-105 sm:bottom-6 sm:right-6"
      aria-label="Chat with us on WhatsApp"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-whatsapp opacity-20 [animation-duration:2.5s]" aria-hidden="true" />
      <WhatsAppIcon className="relative h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 sm:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
