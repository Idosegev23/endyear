import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heebo: ['Heebo', 'sans-serif'],
      },
      colors: {
        'bg-base': '#F5F5F5',
        'near-black': '#0A0A0A',
        'dark-900': '#111111',
        'dark-800': '#1A1A1A',
        'dark-700': '#2A2A2A',
        'gold-main': '#C9A04A',
        'gold-secondary': '#B8934A',
        'gold-accent': '#D4AF37',
        'green-accent': '#175933',
        'deep-black': '#050505',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'input': '0 1px 3px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;

