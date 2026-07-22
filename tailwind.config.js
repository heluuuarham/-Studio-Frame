/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#F7F5F0',
          100: '#EFEAE1',
          200: '#D9D3C5',
          300: '#B9B2A2',
          400: '#8E96A3',
          500: '#6B7280',
        },
        workshop: {
          900: '#0E1014',
          800: '#12151A',
          700: '#1B2028',
          600: '#242A35',
          500: '#2E3644',
        },
        brass: {
          400: '#E0BC6A',
          500: '#C9A24B',
          600: '#A07E2F',
          700: '#7A5E22',
        },
        stamp: {
          500: '#C1443B',
          600: '#A83A32',
        },
        teal: {
          500: '#4C9C93',
          600: '#3A7A72',
        },
      },
      fontFamily: {
        display: ['"Anton"', 'sans-serif'],
        serif: ['"Fraunces"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      maxWidth: {
        shell: '1280px',
      },
      keyframes: {
        toastIn: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(20px) scale(0.96)' },
        },
        flyToCart: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8' },
          '100%': { opacity: '0', transform: 'scale(0.2) translate(var(--fly-x), var(--fly-y))' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        toastIn: 'toastIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        toastOut: 'toastOut 0.3s ease forwards',
        flyToCart: 'flyToCart 0.7s cubic-bezier(0.5,-0.2,0.7,1) forwards',
        fadeUp: 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        shimmer: 'shimmer 1.5s linear infinite',
      },
    },
  },
  plugins: [],
};
