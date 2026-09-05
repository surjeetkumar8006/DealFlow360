/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#1d63ed',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        header: {
          blue: '#1d4ed8',
          dark: '#18181b',
        },
        canvas: '#f8fafc',
        card: {
          light: '#f1f5f9',
          border: '#e2e8f0',
          hoverBorder: '#3b82f6',
        },
        alert: {
          bg: '#fef9c3',
          border: '#fde047',
          text: '#713f12',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 12px 0 rgba(29, 99, 237, 0.12), 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
