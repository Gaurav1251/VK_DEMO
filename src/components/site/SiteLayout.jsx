import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';
import EnquiryModal from './EnquiryModal';
import WhatsAppFloat from './WhatsAppFloat';
import { EnquiryModalContext } from './enquiryModalContext';

export default function SiteLayout() {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    setEnquiryOpen(false);
  }, [pathname, search]);

  const enquiry = useMemo(() => ({ open: () => setEnquiryOpen(true), close: () => setEnquiryOpen(false) }), []);

  return (
    <EnquiryModalContext.Provider value={enquiry}>
      <a href="#main" className="sr-only z-[90] rounded-lg bg-white px-4 py-2 font-semibold text-brand focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <TopBar />
      <Header onOpenEnquiry={enquiry.open} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <EnquiryModal open={enquiryOpen} onClose={enquiry.close} />
    </EnquiryModalContext.Provider>
  );
}
