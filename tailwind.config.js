/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        // Primary palette - Bilbao-inspired
        terracota: {
          DEFAULT: '#C45C3E',
          50: '#F5E6E1',
          100: '#EDD5CA',
          200: '#DBA89B',
          300: '#C97D6A',
          400: '#C45C3E',
          500: '#A84A32',
          600: '#8C3E28',
          700: '#6F311F',
          800: '#532416',
          900: '#3A1A0F',
        },
        verde: {
          montana: {
            DEFAULT: '#4A6741',
            50: '#E8EDE6',
            100: '#D1DCCD',
            200: '#A4B99B',
            300: '#769668',
            400: '#4A6741',
            500: '#3B5235',
            600: '#2D3E28',
            700: '#1F2A1B',
            800: '#11160E',
            900: '#030402',
          },
          txakoli: {
            DEFAULT: '#7FA650',
            50: '#F1F5E6',
            100: '#E3EBCD',
            200: '#C7D89B',
            300: '#ABC469',
            400: '#8FB038',
            500: '#7FA650',
            600: '#668542',
            700: '#4D6432',
            800: '#344423',
            900: '#1B2314',
          },
        },
        crema: '#FAF7F2',
        blanco: '#FFFFFF',
        grafito: '#2D2D2D',
        gris: '#6B6B6B',
        beige: '#E8E2D9',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(45, 30, 15, 0.08)',
        'card-hover': '0 4px 16px rgba(45, 30, 15, 0.12)',
        'card-active': '0 1px 4px rgba(45, 30, 15, 0.06)',
      },
    },
  },
  plugins: [],
}
