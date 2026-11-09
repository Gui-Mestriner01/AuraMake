/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F4',
        sand: '#F2E9E2',
        clay: '#E3D3C8',
        ink: '#2B2522',
        mute: '#8A7A71',
        rose: '#C2847A',
        rosedeep: '#A4665C',
        gold: '#C3A26B'
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 1px 2px rgba(43,37,34,.04), 0 12px 32px -12px rgba(43,37,34,.14)',
        lift: '0 2px 4px rgba(43,37,34,.05), 0 24px 48px -16px rgba(43,37,34,.22)'
      },
      borderRadius: { xl2: '1.25rem' }
    }
  },
  plugins: []
}
