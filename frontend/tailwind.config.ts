import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4F5F3',
        card: '#FFFFFF',
        ink: '#171B1A',
        muted: '#5C6764',
        line: '#DCE0DC',
        accent: {
          DEFAULT: '#1F5F4E',
          soft: '#E5EFEA',
          strong: '#164739',
        },
        danger: '#A33127',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        panel: '0 1px 2px rgba(23, 27, 26, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
