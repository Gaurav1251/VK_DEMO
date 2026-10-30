import { useState } from 'react';
import { CheckCircle2, Clock, ExternalLink, Mail, MapPin, Phone, Send } from 'lucide-react';
import PageHeader from '../components/site/PageHeader';
import Field from '../components/ui/Field';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { isEmail, isPhone, mapsLink, telHref, whatsappLink } from '../lib/utils';

const EMPTY = { name: '', company: '', email: '', phone: '', country: 'India', requirement: '' };

function InfoCard({ icon: Icon, title, children }) {
  return (
    <div className="card card-glow flex gap-4 p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 text-sm leading-relaxed">
        <h3 className="text-[15px] font-bold">{title}</h3>
        <div className="mt-1 text-muted">{children}</div>
      </div>
    </div>
  );
}

export default function Contact() {
  const { settings, addEnquiry } = useStore();
  const toast = useToast();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(null);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!form.email.trim()) next.email = 'Please enter your email';
    else if (!isEmail(form.email)) next.email = 'Please enter a valid email address, e.g. name@company.com';
    if (!isPhone(form.phone)) next.phone = 'Please enter a valid phone number';
    if (!form.requirement.trim()) next.requirement = 'Please tell us what you need';
    else if (form.requirement.trim().length < 10) next.requirement = 'Please add a little more detail (at least 10 characters)';
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`f-c-${Object.keys(next)[0]}`)?.focus();
      return;
    }
    const ok = addEnquiry({
      name: form.name.trim(),
      company: form.company.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      country: form.country.trim(),
      message: form.requirement.trim(),
      items: [],
      source: 'Contact form',
    });
    if (!ok) {
      toast('Could not send your enquiry. Browser storage may be full.', 'error');
      return;
    }
    setSent({ name: form.name.trim().split(' ')[0], email: form.email.trim() });
    setForm(EMPTY);
    toast('Thank you! Your enquiry has been sent');
  };

  return (
    <>
      <PageHeader
        title="Contact us"
        image="/images/vk-lathe-sparks.jpg"
        subtitle="Send us your drawing, sample details or part list — our sales team replies within one working day."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <section className="container-x grid gap-8 py-12 sm:py-16 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
        <div className="space-y-4">
          <InfoCard icon={MapPin} title="Corporate office">
            {settings.address}
          </InfoCard>
          <InfoCard icon={Phone} title="Phone">
            <a href={telHref(settings.phone1)} className="block font-semibold text-ink hover:text-brand">{settings.phone1}</a>
            {settings.phone2 && <a href={telHref(settings.phone2)} className="block font-semibold text-ink hover:text-brand">{settings.phone2}</a>}
          </InfoCard>
          <InfoCard icon={Mail} title="Email">
            <a href={`mailto:${settings.salesEmail}`} className="block break-all font-semibold text-ink hover:text-brand">{settings.salesEmail}</a>
            {settings.generalEmail && <a href={`mailto:${settings.generalEmail}`} className="block break-all font-semibold text-ink hover:text-brand">{settings.generalEmail}</a>}
          </InfoCard>
          <InfoCard icon={Clock} title="Working hours">
            {settings.hours}
          </InfoCard>

          <div className="card card-glow overflow-hidden">
            <div className="drawing-bg relative h-56">
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                <path d="M-10 150 C 80 120, 160 170, 240 120 S 380 70, 420 90" fill="none" stroke="#fff" strokeWidth="14" />
                <path d="M-10 150 C 80 120, 160 170, 240 120 S 380 70, 420 90" fill="none" stroke="#C9D6EC" strokeWidth="10" />
                <path d="M120 -10 L 170 230" fill="none" stroke="#fff" strokeWidth="9" />
                <path d="M300 -10 L 260 230" fill="none" stroke="#fff" strokeWidth="7" />
                <rect x="40" y="30" width="60" height="40" rx="4" fill="#DCE5F4" />
                <rect x="190" y="40" width="50" height="34" rx="4" fill="#DCE5F4" />
                <rect x="290" y="140" width="70" height="44" rx="4" fill="#DCE5F4" />
                <rect x="50" y="170" width="54" height="30" rx="4" fill="#DCE5F4" />
              </svg>
              <div className="absolute left-1/2 top-[42%] flex -translate-x-1/2 -translate-y-full flex-col items-center">
                <span className="whitespace-nowrap rounded-lg bg-ink px-3 py-1.5 text-xs font-bold text-white shadow-lift">VK India · GIDC II</span>
                <MapPin className="mt-1 h-9 w-9 fill-accent text-white drop-shadow" aria-hidden="true" />
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <p className="text-sm">
                <span className="block font-bold">Dared, Jamnagar</span>
                <span className="text-muted">Gujarat 361004, India</span>
              </p>
              <a href={mapsLink(settings.address)} target="_blank" rel="noopener noreferrer" className="btn btn-outline-blue btn-sm">
                Open in Google Maps <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="card p-6 sm:p-8 lg:self-start">
          {sent ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
              </span>
              <h2 className="mt-6 text-2xl font-extrabold">Thank you, {sent.name}!</h2>
              <p className="mt-2 max-w-md text-[15px] leading-relaxed text-muted">
                We have received your enquiry and will reply to <span className="font-semibold text-ink">{sent.email}</span> within one working day.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <button type="button" className="btn btn-outline" onClick={() => setSent(null)}>
                  Send another enquiry
                </button>
                <a href={whatsappLink(settings.whatsapp, 'Hello VK India, I just sent an enquiry through your website.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  <WhatsAppIcon className="h-4 w-4" /> Follow up on WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <p className="eyebrow">Request a quote</p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-[28px]">Send us an enquiry</h2>
              <p className="mt-2 text-sm text-muted">
                Fields marked <span className="text-accent">*</span> are required.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="c-name" required value={form.name} onChange={update('name')} error={errors.name} autoComplete="name" />
                <Field label="Company" name="c-company" value={form.company} onChange={update('company')} autoComplete="organization" />
                <Field label="Email" name="c-email" type="email" required value={form.email} onChange={update('email')} error={errors.email} autoComplete="email" />
                <Field label="Phone" name="c-phone" type="tel" value={form.phone} onChange={update('phone')} error={errors.phone} autoComplete="tel" placeholder="+91 98765 43210" />
                <Field label="Country" name="c-country" value={form.country} onChange={update('country')} autoComplete="country-name" className="sm:col-span-2" />
                <Field
                  label="Your requirement"
                  name="c-requirement"
                  as="textarea"
                  rows={5}
                  required
                  value={form.requirement}
                  onChange={update('requirement')}
                  error={errors.requirement}
                  placeholder="Part name, drawing number, material, quantity, plating and delivery location…"
                  className="sm:col-span-2"
                />
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted">We reply within one working day. Your details are never shared.</p>
                <button type="submit" className="btn btn-primary btn-lg">
                  <Send className="h-4 w-4" aria-hidden="true" /> Send enquiry
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
