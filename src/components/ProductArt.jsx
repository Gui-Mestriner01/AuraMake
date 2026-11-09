/**
 * Ilustração "solo" do produto: um item por vez, centralizado, fundo neutro.
 * Usada quando o produto ainda não tem foto real (campo `image` vazio).
 * Basta preencher `image` no cadastro que a foto substitui o desenho.
 */

const escurecer = (hex, f = 0.78) => {
  const n = parseInt(hex.replace('#', ''), 16)
  const r = Math.round(((n >> 16) & 255) * f)
  const g = Math.round(((n >> 8) & 255) * f)
  const b = Math.round((n & 255) * f)
  return `rgb(${r},${g},${b})`
}
const clarear = (hex, f = 0.35) => {
  const n = parseInt(hex.replace('#', ''), 16)
  const mix = (c) => Math.round(c + (255 - c) * f)
  return `rgb(${mix((n >> 16) & 255)},${mix((n >> 8) & 255)},${mix(n & 255)})`
}

function Desenho({ tipo, tom }) {
  const escuro = escurecer(tom)
  const claro = clarear(tom)
  const metal = '#D9C7BA'
  const metalEscuro = '#B49C8D'
  const preto = '#272220'

  switch (tipo) {
    case 'batom':
      return (
        <g>
          <rect x="80" y="126" width="40" height="74" rx="5" fill={metal} />
          <rect x="80" y="126" width="13" height="74" fill="#fff" opacity=".4" />
          <rect x="78" y="117" width="44" height="11" rx="3" fill={metalEscuro} />
          <rect x="84" y="98" width="32" height="20" rx="2" fill={metalEscuro} />
          <path d="M84 98 V68 C84 59 91 52 103 47 L116 42 V98 Z" fill={tom} />
          <path d="M84 98 V68 C84 61 88 55 94 51 V98 Z" fill={claro} opacity=".5" />
          <path d="M109 45 L116 42 V98 h-7 Z" fill={escuro} />
        </g>
      )

    case 'gloss':
      return (
        <g>
          <rect x="86" y="118" width="30" height="82" rx="14" fill={tom} opacity=".85" />
          <rect x="91" y="126" width="8" height="64" rx="4" fill="#fff" opacity=".4" />
          <rect x="88" y="110" width="26" height="12" rx="3" fill={metalEscuro} />
          <rect x="90" y="60" width="22" height="52" rx="7" fill={preto} />
          <rect x="94" y="66" width="5" height="38" rx="2.5" fill="#fff" opacity=".18" />
          <ellipse cx="101" cy="56" rx="9" ry="6" fill={escuro} />
        </g>
      )

    case 'paleta':
      return (
        <g>
          <rect x="30" y="80" width="140" height="92" rx="12" fill={preto} />
          <rect x="30" y="80" width="140" height="10" rx="5" fill="#3B3431" />
          <rect x="38" y="94" width="124" height="70" rx="7" fill="#37302D" />
          {[0, 1, 2, 3].map((c) =>
            [0, 1].map((r) => {
              const tons = [claro, tom, '#C9A08A', '#8D6E63', '#E3C3AE', '#A4756A', '#6E524A', escuro]
              const i = r * 4 + c
              return (
                <rect
                  key={`${c}-${r}`}
                  x={46 + c * 29}
                  y={102 + r * 29}
                  width="24"
                  height="24"
                  rx="4"
                  fill={tons[i]}
                />
              )
            })
          )}
          <rect x="30" y="80" width="140" height="92" rx="12" fill="none" stroke="#000" opacity=".15" />
        </g>
      )

    case 'base':
      return (
        <g>
          <rect x="70" y="100" width="60" height="100" rx="9" fill={tom} opacity=".9" />
          <rect x="76" y="108" width="12" height="84" rx="6" fill="#fff" opacity=".35" />
          <rect x="70" y="100" width="60" height="100" rx="9" fill="none" stroke={escuro} opacity=".35" />
          <rect x="88" y="84" width="24" height="18" fill="#E6DAD1" />
          <rect x="82" y="66" width="36" height="20" rx="6" fill={preto} />
          <rect x="62" y="70" width="22" height="9" rx="4" fill={preto} />
          <rect x="86" y="70" width="6" height="12" rx="3" fill="#fff" opacity=".2" />
        </g>
      )

    case 'mascara':
      return (
        <g>
          <rect x="82" y="112" width="36" height="88" rx="9" fill={preto} />
          <rect x="88" y="120" width="8" height="70" rx="4" fill="#fff" opacity=".14" />
          <rect x="86" y="104" width="28" height="10" rx="3" fill="#3B3431" />
          <rect x="88" y="52" width="24" height="54" rx="7" fill={tom === preto ? '#3B3431' : tom} />
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x="88" y={58 + i * 9} width="24" height="2.5" fill="#000" opacity=".22" />
          ))}
          <rect x="94" y="44" width="12" height="10" rx="3" fill={metalEscuro} />
        </g>
      )

    case 'blush':
    case 'po':
      return (
        <g>
          <circle cx="100" cy="142" r="56" fill="#EFE4DC" />
          <circle cx="100" cy="142" r="56" fill="none" stroke={metalEscuro} opacity=".4" />
          <circle cx="100" cy="142" r="44" fill="#E3D3C8" />
          <circle cx="100" cy="142" r="38" fill={tom} />
          <circle cx="100" cy="142" r="38" fill="none" stroke={escuro} opacity=".3" />
          <ellipse cx="86" cy="126" rx="16" ry="11" fill="#fff" opacity=".28" transform="rotate(-25 86 126)" />
          <path d="M44 142 a56 56 0 0 1 56 -56" fill="none" stroke="#fff" strokeWidth="3" opacity=".5" />
        </g>
      )

    case 'pincel':
      return (
        <g>
          <path d="M96 196 L104 196 L108 112 L92 112 Z" fill={escurecer('#6B4A3A', 0.95)} />
          <path d="M96 196 L100 196 L102 112 L92 112 Z" fill="#8A6350" />
          <rect x="88" y="86" width="24" height="28" rx="3" fill={tom} />
          <rect x="88" y="92" width="24" height="2.5" fill="#fff" opacity=".35" />
          <rect x="88" y="104" width="24" height="2.5" fill="#000" opacity=".15" />
          <path d="M88 88 C84 64 90 44 100 38 C110 44 116 64 112 88 Z" fill="#2B2522" opacity=".82" />
          <path d="M94 86 C92 64 95 48 100 40 C103 48 105 64 104 86 Z" fill="#514642" opacity=".7" />
        </g>
      )

    case 'delineador':
      return (
        <g>
          <rect x="88" y="96" width="24" height="104" rx="9" fill={preto} />
          <rect x="93" y="104" width="6" height="86" rx="3" fill="#fff" opacity=".14" />
          <rect x="86" y="88" width="28" height="10" rx="3" fill={metalEscuro} />
          <path d="M92 88 L100 40 L108 88 Z" fill={tom === preto ? '#1C1816' : tom} />
          <path d="M98 88 L100 40 L102 88 Z" fill="#fff" opacity=".18" />
        </g>
      )

    case 'serum':
      return (
        <g>
          <rect x="74" y="104" width="52" height="92" rx="10" fill={tom} opacity=".55" />
          <rect x="74" y="132" width="52" height="64" rx="10" fill={tom} opacity=".85" />
          <rect x="80" y="112" width="10" height="76" rx="5" fill="#fff" opacity=".4" />
          <rect x="74" y="104" width="52" height="92" rx="10" fill="none" stroke={escuro} opacity=".3" />
          <rect x="88" y="90" width="24" height="16" fill="#E6DAD1" />
          <rect x="84" y="72" width="32" height="20" rx="5" fill={preto} />
          <rect x="94" y="44" width="12" height="30" rx="6" fill="#C9B8AE" />
        </g>
      )

    case 'creme':
      return (
        <g>
          <rect x="60" y="124" width="80" height="72" rx="12" fill={tom} opacity=".8" />
          <rect x="68" y="134" width="12" height="52" rx="6" fill="#fff" opacity=".45" />
          <rect x="60" y="124" width="80" height="72" rx="12" fill="none" stroke={escuro} opacity=".3" />
          <rect x="54" y="98" width="92" height="30" rx="10" fill="#E6DAD1" />
          <rect x="54" y="98" width="92" height="12" rx="6" fill="#F3EAE3" />
          <rect x="54" y="98" width="92" height="30" rx="10" fill="none" stroke={metalEscuro} opacity=".45" />
        </g>
      )

    default:
      return (
        <g>
          <rect x="72" y="92" width="56" height="106" rx="10" fill={tom} opacity=".85" />
          <rect x="79" y="102" width="11" height="86" rx="5" fill="#fff" opacity=".4" />
          <rect x="84" y="72" width="32" height="22" rx="6" fill={preto} />
        </g>
      )
  }
}

export default function ProductArt({ produto, className = '' }) {
  if (produto?.image) {
    return (
      <img
        src={produto.image}
        alt={produto.nome}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  const tom = produto?.tom || '#C2847A'
  const id = `halo-${produto?.id || 'x'}`

  return (
    <svg
      viewBox="0 0 200 240"
      className={`h-full w-full ${className}`}
      role="img"
      aria-label={produto?.nome || 'Produto'}
    >
      <defs>
        <radialGradient id={id} cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F0E5DC" />
        </radialGradient>
      </defs>
      <rect width="200" height="240" fill={`url(#${id})`} />
      <circle cx="100" cy="112" r="74" fill="#fff" opacity=".55" />
      <ellipse cx="100" cy="206" rx="52" ry="9" fill="#B49C8D" opacity=".22" />
      <Desenho tipo={produto?.tipo} tom={tom} />
    </svg>
  )
}
