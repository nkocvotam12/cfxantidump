// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-primary': '#050505',
        'bg-secondary': '#0a0a0a',
        'bg-card': '#0f0f0f',
        'bg-elevated': '#161616',
        'bg-hover': '#1f1f1f',
        'bg-border': 'rgba(255,255,255,0.08)',
        'text-primary': '#ffffff',
        'text-secondary': '#d4d4d8',
        'text-muted': '#a1a1aa',
        'accent-blue': '#ef4444',
        'accent-blue-bright': '#f87171',
        'accent-red': '#ef4444',
        'accent-green': '#22c55e',
        'accent-purple': '#ef4444',
        'accent-yellow': '#f59e0b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;