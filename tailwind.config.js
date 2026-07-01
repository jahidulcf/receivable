/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neutral': {
          '50': '#F3F4F6',
          '100': '#E5E7EB',
          '200': '#D1D5DB',
          '300': '#9CA3AF',
          '400': '#6B7280',
          '500': '#4B5563',
          '600': '#374151',
          '700': '#1F2937',
          '800': '#111827',
          '900': '#030712',
        }
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      spacing: {
        '44': '2.75rem',
      },
      minHeight: {
        '44': '2.75rem',
      },
      minWidth: {
        '44': '2.75rem',
      }
    },
  },
  plugins: [],
}