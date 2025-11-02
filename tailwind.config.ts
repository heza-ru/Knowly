import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Default dark theme
        dark: {
          bg: '#0f0f0f',
          surface: '#1a1a1a',
          surfaceHover: '#252525',
          border: '#2a2a2a',
          text: '#f5f5f5',
          textMuted: '#a0a0a0',
        },
        // Additional theme palettes will be defined in CSS variables
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        hindi: ['var(--font-hindi)', 'Noto Sans Devanagari', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
