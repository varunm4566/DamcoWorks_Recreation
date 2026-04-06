/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Layout
        'sidebar': '#101726',
        'nav-active': '#e32200',
        'page-bg': '#f7f8fc',
        'footer-bg': '#494949',
        // Attention status badges
        'urgent': '#c92a2a',
        'critical': '#ef4444',
        'moderate': '#fbbf24',
        // Bench values
        'bench-blue': '#1a79cb',
        'bench-green': '#02942e',
        'bench-dark-red': '#7f1d1d',
        // Aging brackets
        'aging-green': '#059669',
        'aging-amber': '#d97706',
        'aging-red': '#dc2626',
        // UI accents
        'billed-green': '#488f31',
        'bench-pill-border': '#4c8bf5',
        'bench-pill-bg': '#eef4ff',
        'active-page': '#373f50',
        'tbd-gray': '#858686',
        'forecast-gray': '#4d5156',
        'text-secondary': '#595959',
        'chip-border': '#d3d3d3',
        'chip-bg': '#f5f5f5',
        'tag-bg': '#dee2e6',
        'table-header': '#f1f1f1',
        'table-border': '#dee2e6',
        'hr-border': '#bfbfbf',
      },
    },
  },
  plugins: [],
};
