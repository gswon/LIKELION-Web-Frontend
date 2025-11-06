/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nyu-purple': '#57068c',
        'll-orange': '#FF6000'
      },
      boxShadow: {
        'custom': '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
        'button': '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
        'card': '4px 10px 4px 0 rgba(0, 0, 0, 0.25)',
        'members': '2px 5px 4px 0 rgba(0, 0, 0, 0.25)',
        'hover': '0 6px 8px 0 rgba(0, 0, 0, 0.3)'
      },
      keyframes: {
        'button-pop': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-3px)' }
        }
      },
      animation: {
        'button-pop': 'button-pop 0.2s ease-out forwards'
      }
    },
  },
  plugins: [],
}
