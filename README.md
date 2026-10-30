# VK India — website & admin demo

Client demo for VK India, a precision brass components manufacturer in Jamnagar (since 2006).
React + Vite + Tailwind CSS + React Router. There is **no backend**: all data lives in the browser's `localStorage`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # serve the build at http://localhost:4173
```

## Admin

The admin panel is not linked from the public site. Open **`/admin`** directly.

- Username: `admin`
- Password: `admin123`

Admin changes (products, categories, settings, enquiry status) show on the public site immediately — including in other open tabs.
**Reset demo data** in the sidebar restores the original seed data.

## Where things are

| Path | What |
|---|---|
| `src/lib/storage.js` | The only file that touches `localStorage` (every read/write in try/catch) |
| `src/lib/seed.js` | Seed settings, 7 categories, 21 products, 4 sample enquiries |
| `src/context/StoreContext.jsx` | App state + all actions (save product, add enquiry, …) |
| `src/components/PartDrawing.jsx` | 16 SVG line drawings used when a product has no photo |
| `src/components/site/` | Public header, footer, "My Enquiry" modal, product card, hero drawing |
| `src/pages/` | Public pages: Home, About, Products, Product detail, Quality, Contact |
| `src/admin/` | Login, layout, dashboard, products, categories, enquiries, settings |
| `public/images/` | Product category and factory photos |

## Notes

- Uploaded photos are resized to max 640 px JPEG and stored as base64. Browsers allow roughly 5 MB of `localStorage`, so a few dozen photos is the practical limit — the app shows an error toast if storage is full.
- Data is per-browser: an enquiry sent on one device is only visible in the admin panel on that same browser. A real backend is needed for production.
- Deep links (`/products/...`, `/admin/...`) need an SPA fallback on the host. `public/_redirects` (Netlify) and `vercel.json` (Vercel) are included.
