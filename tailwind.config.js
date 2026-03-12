/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E07845',
        'primary-light': '#F5A07A',
        'primary-dark': '#C45E2D',
        teal: '#5A9EA0',
        'teal-light': '#7BBFC1',
        yellow: '#F2C44E',
        green: '#6EA86A',
        background: '#FBF6F0',
        card: '#FFFFFF',
        'text-dark': '#2C1F13',
        'text-muted': '#8B7355',
        'border-light': '#EDE0D0',
        purple: '#9B7EC8',
        rose: '#E07080',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
