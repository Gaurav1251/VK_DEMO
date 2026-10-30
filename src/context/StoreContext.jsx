import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { buildSeed, DEFAULT_SETTINGS } from '../lib/seed';
import { KEYS, ensureSeeded, read, storageAvailable, subscribe, write, writeSeed, remove } from '../lib/storage';
import { enquiryId, uniqueId } from '../lib/utils';

const StoreContext = createContext(null);

function load() {
  const seed = buildSeed();
  ensureSeeded(seed);
  return {
    settings: { ...DEFAULT_SETTINGS, ...read(KEYS.settings, {}) },
    categories: read(KEYS.categories, seed.categories),
    products: read(KEYS.products, seed.products),
    enquiries: read(KEYS.enquiries, seed.enquiries),
    cart: read(KEYS.cart, []),
    session: read(KEYS.session, null),
  };
}

export function StoreProvider({ children }) {
  const [data, setDataState] = useState(load);
  // Actions read the latest state synchronously through this ref.
  const dataRef = useRef(data);
  const setData = useCallback((updater) => {
    const next = typeof updater === 'function' ? updater(dataRef.current) : updater;
    dataRef.current = next;
    setDataState(next);
  }, []);

  // Keep every open tab in sync: admin edits in one tab show up on the site in another.
  useEffect(() => subscribe(() => setData(load())), [setData]);

  /**
   * Save one slice. If localStorage works but the write fails (quota full),
   * the change is rejected so the UI never shows data that wasn't saved.
   * If storage is blocked entirely, we keep working in memory.
   */
  const persist = useCallback(
    (slice, value) => {
      const ok = write(KEYS[slice], value);
      if (!ok && storageAvailable()) return false;
      setData((d) => ({ ...d, [slice]: value }));
      return true;
    },
    [setData],
  );

  const actions = useMemo(() => {
    const get = () => dataRef.current;

    return {
      // Settings
      saveSettings: (settings) => persist('settings', { ...get().settings, ...settings }),

      // Products
      saveProduct: (product) => {
        const { products } = get();
        if (product.id && products.some((p) => p.id === product.id)) {
          return persist('products', products.map((p) => (p.id === product.id ? { ...p, ...product } : p)));
        }
        const id = uniqueId(product.name, products.map((p) => p.id));
        return persist('products', [{ ...product, id, createdAt: new Date().toISOString() }, ...products]);
      },
      deleteProduct: (id) => {
        const { products, cart } = get();
        persist('cart', cart.filter((c) => c.productId !== id));
        return persist('products', products.filter((p) => p.id !== id));
      },
      toggleProductActive: (id) => {
        const { products } = get();
        return persist('products', products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
      },

      // Categories
      saveCategory: (category) => {
        const { categories } = get();
        if (category.id && categories.some((c) => c.id === category.id)) {
          return persist('categories', categories.map((c) => (c.id === category.id ? { ...c, ...category } : c)));
        }
        const id = uniqueId(category.name, categories.map((c) => c.id));
        return persist('categories', [...categories, { ...category, id }]);
      },
      deleteCategory: (id) => {
        const { categories, products } = get();
        if (products.some((p) => p.categoryId === id)) return false;
        return persist('categories', categories.filter((c) => c.id !== id));
      },

      // Enquiries
      addEnquiry: (enquiry) => {
        const { enquiries } = get();
        const record = { id: enquiryId(), createdAt: new Date().toISOString(), status: 'New', ...enquiry };
        return persist('enquiries', [record, ...enquiries]);
      },
      setEnquiryStatus: (id, status) => {
        const { enquiries } = get();
        return persist('enquiries', enquiries.map((e) => (e.id === id ? { ...e, status } : e)));
      },
      deleteEnquiry: (id) => {
        const { enquiries } = get();
        return persist('enquiries', enquiries.filter((e) => e.id !== id));
      },

      // My Enquiry (the B2B "cart")
      addToCart: (productId, qty = 1) => {
        const { cart } = get();
        const existing = cart.find((c) => c.productId === productId);
        const next = existing
          ? cart.map((c) => (c.productId === productId ? { ...c, qty: Math.max(1, Number(qty) || 1) } : c))
          : [...cart, { productId, qty: Math.max(1, Number(qty) || 1) }];
        return persist('cart', next);
      },
      setCartQty: (productId, qty) => {
        const { cart } = get();
        return persist('cart', cart.map((c) => (c.productId === productId ? { ...c, qty } : c)));
      },
      removeFromCart: (productId) => {
        const { cart } = get();
        return persist('cart', cart.filter((c) => c.productId !== productId));
      },
      clearCart: () => persist('cart', []),

      // Admin session
      login: (username) => persist('session', { user: username, at: new Date().toISOString() }),
      logout: () => {
        remove(KEYS.session);
        setData((d) => ({ ...d, session: null }));
      },

      resetDemo: () => {
        const seed = buildSeed();
        writeSeed(seed);
        setData((d) => ({ ...d, ...seed, settings: { ...seed.settings }, cart: [] }));
        return true;
      },
    };
  }, [persist, setData]);

  const value = useMemo(() => ({ ...data, ...actions }), [data, actions]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}

/** Products visible on the public site, with their category attached. */
export function usePublicCatalog() {
  const { products, categories } = useStore();
  return useMemo(() => {
    const byId = Object.fromEntries(categories.map((c) => [c.id, c]));
    const visible = products.filter((p) => p.active && byId[p.categoryId]);
    const counts = {};
    visible.forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return { products: visible, categories, categoryById: byId, counts };
  }, [products, categories]);
}
