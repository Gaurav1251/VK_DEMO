import { useEffect, useState } from 'react';
import { Home, Phone, Save } from 'lucide-react';
import { AdminPageHeader } from './AdminLayout';
import Field from '../components/ui/Field';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/ToastContext';
import { isEmail, isPhone } from '../lib/utils';

const CONTACT_FIELDS = [
  { key: 'phone1', label: 'Phone 1', required: true, type: 'tel' },
  { key: 'phone2', label: 'Phone 2', type: 'tel' },
  { key: 'salesEmail', label: 'Sales email', required: true, type: 'email' },
  { key: 'generalEmail', label: 'General email', type: 'email' },
  { key: 'whatsapp', label: 'WhatsApp number', required: true, hint: 'Country code + number, digits only, e.g. 917573001105' },
  { key: 'hours', label: 'Working hours', required: true },
];

function validate(form) {
  const e = {};
  if (!form.heroHeadline.trim()) e.heroHeadline = 'Hero headline is required';
  if (!form.heroText.trim()) e.heroText = 'Hero text is required';
  if (!form.phone1.trim()) e.phone1 = 'Phone 1 is required';
  else if (!isPhone(form.phone1)) e.phone1 = 'Enter a valid phone number';
  if (form.phone2 && !isPhone(form.phone2)) e.phone2 = 'Enter a valid phone number';
  if (!form.salesEmail.trim()) e.salesEmail = 'Sales email is required';
  else if (!isEmail(form.salesEmail)) e.salesEmail = 'Enter a valid email address';
  if (form.generalEmail && !isEmail(form.generalEmail)) e.generalEmail = 'Enter a valid email address';
  if (!form.address.trim()) e.address = 'Address is required';
  if (!/^\d{10,15}$/.test(form.whatsapp.trim())) e.whatsapp = 'Use 10–15 digits with country code, no spaces or +';
  if (!form.hours.trim()) e.hours = 'Working hours are required';
  return e;
}

export default function AdminSettings() {
  const { settings, saveSettings } = useStore();
  const toast = useToast();
  const [form, setForm] = useState(settings);
  const [errors, setErrors] = useState({});

  // If settings change elsewhere (reset, another tab), reload the form.
  useEffect(() => setForm(settings), [settings]);

  const dirty = JSON.stringify(form) !== JSON.stringify(settings);
  const bind = (key) => ({
    value: form[key] ?? '',
    onChange: (e) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
    },
  });

  const submit = (e) => {
    e.preventDefault();
    const next = validate(form);
    setErrors(next);
    if (Object.keys(next).length) {
      document.getElementById(`f-s-${Object.keys(next)[0]}`)?.focus();
      toast('Please fix the highlighted fields', 'error');
      return;
    }
    const clean = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, String(v).trim()]));
    if (saveSettings(clean)) toast('Settings saved — the website is updated');
    else toast('Could not save settings — browser storage is full', 'error');
  };

  return (
    <>
      <AdminPageHeader title="Site settings" subtitle="Changes appear on the public website as soon as you save." />
      <form onSubmit={submit} noValidate className="card overflow-hidden">
        <section className="border-b border-line p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-tint text-brand">
              <Home className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-bold">Homepage</h2>
              <p className="text-xs text-muted">The main headline and text in the hero banner</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4">
            <Field label="Hero headline" name="s-heroHeadline" required {...bind('heroHeadline')} error={errors.heroHeadline} />
            <Field label="Hero text" name="s-heroText" as="textarea" rows={3} required {...bind('heroText')} error={errors.heroText} />
          </div>
        </section>

        <section className="p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-tint text-brand">
              <Phone className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-bold">Contact details</h2>
              <p className="text-xs text-muted">Shown in the top bar, footer, contact page and WhatsApp buttons</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {CONTACT_FIELDS.map((f) => (
              <Field key={f.key} label={f.label} name={`s-${f.key}`} type={f.type} required={f.required} hint={f.hint} {...bind(f.key)} error={errors[f.key]} />
            ))}
            <Field label="Address" name="s-address" as="textarea" rows={2} required {...bind('address')} error={errors.address} className="md:col-span-2" />
          </div>
        </section>

        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-line bg-white/95 px-5 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <p className="text-xs text-muted">{dirty ? 'You have unsaved changes.' : 'All changes saved.'}</p>
          <div className="flex gap-2.5">
            {dirty && (
              <button type="button" className="btn btn-outline" onClick={() => (setForm(settings), setErrors({}))}>
                Discard
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={!dirty}>
              <Save className="h-4 w-4" aria-hidden="true" /> Save settings
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
