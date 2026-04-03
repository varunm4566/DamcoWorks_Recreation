import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        'base': '13px',
      },
      colors: {
        brand: {
          red: '#E32200',
          navy: '#101726',
        },
        page: '#F7F8FC',
        card: '#E1E2E4',
        'table-header': '#F1F1F1',
        'row-even': '#F5F5F5',
        'footer-bg': '#494949',
        border: '#DEE2E6',
        'border-light': '#E0DFDF',
        'text-primary': '#0A0D12',
        'text-secondary': '#4D5156',
        'text-muted': '#595959',
        'text-dark': '#272B30',
        health: {
          green: '#0C8B14',
          orange: '#E58715',
          red: '#FA0000',
        },
        'active-txt': '#008000',
        tier: {
          'rc-bg': '#FFEEEE',
          'rc-text': '#E32200',
          'gold-bg': '#FFFBE8',
          'gold-text': '#7C6A00',
          'strat-bg': '#DDE3FF',
          'strat-text': '#0023C2',
        },
        chip: {
          'active-bg': '#ADCFAD',
          'blue-bg': '#CDE1FF',
          'blue-text': '#2680FF',
        },
        avatar: '#330033',
        tag: {
          offering: '#DEF9FF',
          domain: '#F6DAFF',
          geography: '#E5EBFE',
          currency: '#FFF6EA',
          status: '#DCFFE3',
          risk: '#FFE0DD',
        },
        indigo: {
          tab: '#4338CA',
          'tab-bg': 'rgba(99,102,241,0.1)',
        },
        overdue: {
          bg: '#FEE2E2',
          text: '#B91C1C',
        },
      },
    },
  },
  plugins: [],
};
