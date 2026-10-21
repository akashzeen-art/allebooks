/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#05070f',
          900: '#0a0e1a',
          800: '#111827',
          700: '#1a2236',
          600: '#243049',
        },
        gold: {
          50: '#fdf8ef',
          100: '#f9edcf',
          200: '#f2d89a',
          300: '#e8c06a',
          400: '#d4a84b',
          500: '#c4922f',
          600: '#a67824',
        },
        amber: {
          DEFAULT: '#d4a84b',
          soft: 'rgba(212, 168, 75, 0.15)',
        },
        text: {
          DEFAULT: '#c8cdd8',
          muted: '#8b93a7',
          heading: '#f5f0e8',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        dmSans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
        glow: '0 0 24px rgba(212, 168, 75, 0.2)',
      },
      backgroundImage: {
        'cinematic':
          'radial-gradient(ellipse at top, rgba(36, 48, 73, 0.45), transparent 55%), linear-gradient(180deg, #05070f 0%, #0a0e1a 50%, #05070f 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.55s ease-out both',
        'slide-up': 'slideUp 0.55s ease-out both',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 168, 75, 0.35)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 168, 75, 0)' },
        },
      },
    },
  },
  plugins: [],
}
