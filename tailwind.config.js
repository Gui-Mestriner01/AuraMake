/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // fundos
        cream: '#FFFAF7',
        sand: '#FBF1EC',
        blush: '#FDF1EC',
        pessego: '#F8D6C8',
        clay: '#EFE2DA',
        // texto
        ink: '#2B2522',
        mute: '#8A7A71',
        // marca
        pink: '#E8106E',
        pinkdeep: '#C40B5B',
        laranja: '#F26A21',
        // aliases usados pelo painel administrativo
        rose: '#E8106E',
        rosedeep: '#C40B5B',
        gold: '#F26A21'
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        eyebrow: '0.28em'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(43,37,34,.04), 0 12px 32px -12px rgba(43,37,34,.14)',
        lift: '0 2px 4px rgba(43,37,34,.05), 0 24px 48px -16px rgba(43,37,34,.22)',
        pink: '0 10px 30px -10px rgba(232,16,110,.55)'
      },
      borderRadius: { xl2: '1.25rem' },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        girar: { to: { transform: 'rotate(360deg)' } },
        brilho: {
          '0%,100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '50%': { transform: 'scale(.82) rotate(45deg)', opacity: '.7' }
        }
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        girar: 'girar 22s linear infinite',
        brilho: 'brilho 3.2s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
