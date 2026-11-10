/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // fundos
        cream: '#FFF7F9',
        sand: '#FFEFF3',
        blush: '#FFE6EE',
        pessego: '#FFD0BD',
        clay: '#F1D3DD',
        // texto
        ink: '#2A0E1B',
        mute: '#85616F',
        // marca
        pink: '#E8106E',
        pinkdeep: '#B80A55',
        laranja: '#F26A21',
        // aliases usados pelo painel administrativo
        rose: '#E8106E',
        rosedeep: '#B80A55',
        gold: '#F26A21'
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'Didot', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        eyebrow: '0.28em'
      },
      boxShadow: {
        soft: '0 1px 2px rgba(42,14,27,.04), 0 12px 32px -12px rgba(42,14,27,.16)',
        lift: '0 2px 4px rgba(42,14,27,.06), 0 24px 48px -16px rgba(42,14,27,.28)',
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
