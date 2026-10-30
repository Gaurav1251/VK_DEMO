/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#0B3D91', dark: '#072B68', deeper: '#051F4D', tint: '#EEF3FB' },
        accent: { DEFAULT: '#F97316', hover: '#EA580C', tint: '#FFF4EB' },
        ink: '#0F1B2D',
        muted: '#5B6878',
        line: '#E3E8EF',
        soft: '#F6F8FB',
        whatsapp: '#25D366',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,27,45,0.05), 0 6px 20px -4px rgba(15,27,45,0.10)',
        lift: '0 4px 10px -2px rgba(15,27,45,0.08), 0 22px 44px -8px rgba(11,61,145,0.24)',
        float: '0 20px 50px rgba(5,31,77,0.18)',
      },
      maxWidth: {
        site: '1240px',
      },
    },
  },
  plugins: [],
};
