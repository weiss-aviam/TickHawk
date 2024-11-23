/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: { "50": "#eff6ff", "100": "#dbeafe", "200": "#bfdbfe", "300": "#93c5fd", "400": "#60a5fa", "500": "#3b82f6", "600": "#2563eb", "700": "#1d4ed8", "800": "#1e40af", "900": "#1e3a8a" }
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
        'body': ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'],
        'mono': ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace']
      },
      transitionProperty: {
        'width': 'width'
      },
      textDecoration: ['active'],
      minWidth: {
        'kanban': '28rem'
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.display-revert': {
          display: 'revert',
        },
      }, {
        variants: ['responsive'], // Permite breakpoints como `xl`
      });
    },
  ],
  safelist: [
    'hidden',
    'w-64',
    'w-1/2',
    'rounded-l-lg',
    'rounded-r-lg',
    'bg-gray-200',
    'grid-cols-4',
    'grid-cols-7',
    'h-6',
    'leading-6',
    'h-9',
    'leading-9',
    'shadow-lg',
    'bg-opacity-50',
    'dark:bg-opacity-80',
    'bg-green-100', 'text-green-800', 'border-green-100',
    'bg-purple-100', 'text-purple-800', 'border-purple-100',
    'bg-orange-100', 'text-orange-800', 'border-orange-100',
    'bg-red-100', 'text-red-800', 'border-red-100',
    'bg-gray-100', 'text-gray-800', 'border-gray-100',
    'dark:bg-gray-700', 'dark:border-green-500', 'dark:text-green-400',
    'dark:border-purple-500', 'dark:text-purple-400',
    'dark:border-orange-500', 'dark:text-orange-400',
    'dark:border-red-500', 'dark:text-red-400',
    'dark:border-gray-500', 'dark:text-gray-400',
  ],
  darkMode: 'class',
}

