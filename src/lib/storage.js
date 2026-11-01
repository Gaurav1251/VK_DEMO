// The single place that touches localStorage. Every read/write is wrapped in
// try/catch so private windows, blocked storage or a full quota never crash the app.

const PREFIX = 'vk_';
const SEED_VERSION = 3;

export const KEYS = {
  settings: 'settings',
  categories: 'categories',
  products: 'products',
  enquiries: 'enquiries',
  orders: 'orders',
  cart: 'enquiry_list',
  session: 'admin_session',
  seeded: 'seed_version',
};

let available = null;

export function storageAvailable() {
  if (available !== null) return available;
  try {
    const probe = `${PREFIX}probe`;
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    available = true;
  } catch {
    available = false;
  }
  return available;
}

export function read(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/** Returns true when the value was saved. False usually means the quota is full. */
export function write(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[storage] could not save "${key}"`, err);
    return false;
  }
}

export function remove(key) {
  try {
    window.localStorage.removeItem(PREFIX + key);
  } catch {
    /* ignore */
  }
}

/** Seed the store on first load (or when the seed format changes). */
export function ensureSeeded(seed) {
  if (read(KEYS.seeded, 0) === SEED_VERSION) return;
  writeSeed(seed);
}

/** Restore every data key to the seed. The admin session is kept. */
export function writeSeed(seed) {
  write(KEYS.settings, seed.settings);
  write(KEYS.categories, seed.categories);
  write(KEYS.products, seed.products);
  write(KEYS.enquiries, seed.enquiries);
  write(KEYS.orders, seed.orders);
  write(KEYS.cart, []);
  write(KEYS.seeded, SEED_VERSION);
}

/** Call `callback` whenever another tab changes our data (e.g. admin in one tab, site in another). */
export function subscribe(callback) {
  const handler = (event) => {
    if (event.key === null || event.key.startsWith(PREFIX)) callback();
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
