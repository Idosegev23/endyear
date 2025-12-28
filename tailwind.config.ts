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
        'bg-base': '#EBECEC',
        'near-black': '#040606',
        'gold-main': '#DDB258',
        'gold-secondary': '#AB8492',
        'green-accent': '#175933',
        'deep-black': '#0B0B0B',
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

