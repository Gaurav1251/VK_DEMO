export const cn = (...classes) => classes.filter(Boolean).join(' ');

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function uniqueId(base, existingIds) {
  const root = slugify(base) || 'item';
  if (!existingIds.includes(root)) return root;
  let n = 2;
  while (existingIds.includes(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

export function enquiryId() {
  return `enq-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function formatDate(iso, withTime = false) {
  try {
    const d = new Date(iso);
    const date = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    if (!withTime) return date;
    const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    return `${date}, ${time}`;
  } catch {
    return '';
  }
}

/** Default enquiry quantity: the number in the product's minimum order ("1,000 pcs" → 1000). */
export function defaultQty(product) {
  const n = parseInt(String(product?.moq || '').replace(/\D/g, ''), 10);
  return n > 0 ? n : 1;
}

export const formatQty = (n) => Number(n || 0).toLocaleString('en-IN');

export const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, '')}`;

export function whatsappLink(number, text = '') {
  const digits = String(number || '').replace(/\D/g, '');
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}

export function mapsLink(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());
export const isPhone = (v) => !v || /^[+\d][\d\s\-()]{6,19}$/.test(String(v).trim());

export function itemsSummary(items = []) {
  if (!items.length) return '—';
  return items.map((i) => `${i.name} × ${formatQty(i.qty)}`).join(', ');
}

export function toCsv(rows) {
  const escape = (value) => {
    const s = String(value ?? '');
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return rows.map((row) => row.map(escape).join(',')).join('\r\n');
}

export function downloadText(filename, text, type = 'text/csv;charset=utf-8') {
  try {
    const blob = new Blob(['﻿', text], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  } catch {
    return false;
  }
}

/** Resize an uploaded image to fit within `max` px and return a base64 JPEG data URL. */
export function resizeImage(file, max = 640, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file (JPG, PNG or WebP).'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('That image could not be opened.'));
      image.onload = () => {
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const w = Math.round(image.width * scale);
        const h = Math.round(image.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        // JPEG has no transparency: paint white first so PNG cut-outs don't turn black.
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(image, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
