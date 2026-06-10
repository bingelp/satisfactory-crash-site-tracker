/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sf-bg': '#0a0b0d',
        'sf-card': '#111418',
        'sf-card-hover': '#161b22',
        'sf-border': '#2a2e36',
        'sf-orange': '#e8820c',
        'sf-orange-light': '#ff9a2e',
        'sf-cyan': '#00d4ff',
        'sf-text': '#c8cdd6',
        'sf-muted': '#6b7280',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}

