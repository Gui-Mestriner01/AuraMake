const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

const Svg = ({ children, size = 20, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} {...base} {...rest}>
    {children}
  </svg>
)

export const Lupa = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Svg>
)
export const Coracao = (p) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z" />
  </Svg>
)
export const Sacola = (p) => (
  <Svg {...p}>
    <path d="M6 8h12l-1 12H7L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
)
export const Menu = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
)
export const X = (p) => (
  <Svg {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
)
export const Seta = (p) => (
  <Svg {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
)
export const Mais = (p) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
)
export const Menos = (p) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
)
export const Lixo = (p) => (
  <Svg {...p}>
    <path d="M4 7h16M10 7V5h4v2M6 7l1 13h10l1-13" />
  </Svg>
)
export const Caixa = (p) => (
  <Svg {...p}>
    <path d="M3 8l9-4 9 4-9 4-9-4Z" />
    <path d="M3 8v8l9 4 9-4V8" />
  </Svg>
)
export const Grafico = (p) => (
  <Svg {...p}>
    <path d="M4 19V5M4 19h16" />
    <path d="M8 16v-4M12 16V8M16 16v-6" />
  </Svg>
)
export const Etiqueta = (p) => (
  <Svg {...p}>
    <path d="M3 12V4h8l9 9-8 8-9-9Z" />
    <circle cx="8" cy="8" r="1.3" />
  </Svg>
)
export const Nota = (p) => (
  <Svg {...p}>
    <path d="M6 3h9l3 3v15H6V3Z" />
    <path d="M9 10h6M9 14h6" />
  </Svg>
)
export const Sair = (p) => (
  <Svg {...p}>
    <path d="M10 5H6v14h4" />
    <path d="M14 12h7M18 8l3 4-3 4" />
  </Svg>
)
export const Check = (p) => (
  <Svg {...p}>
    <path d="m5 13 4 4L19 7" />
  </Svg>
)
export const Zap = (p) => (
  <Svg {...p}>
    <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />
  </Svg>
)
export const Caminhao = (p) => (
  <Svg {...p}>
    <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" />
    <circle cx="7" cy="18" r="1.8" />
    <circle cx="17" cy="18" r="1.8" />
  </Svg>
)
export const Coelho = (p) => (
  <Svg {...p}>
    <path d="M9 12c-2 0-3.5 1.8-3.5 4S7 20 9 20h6c2 0 3.5-1.8 3.5-4S17 12 15 12" />
    <path d="M9.5 12 8 5M14.5 12 16 5" />
  </Svg>
)
export const Selo = (p) => (
  <Svg {...p}>
    <path d="M12 3l2.3 4.7 5.2.8-3.8 3.6.9 5.1L12 14.8l-4.6 2.4.9-5.1L4.5 8.5l5.2-.8L12 3Z" />
  </Svg>
)
export const Whats = (p) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 0 1-11.9 7L4 20l1-4.1A8 8 0 1 1 20 12Z" />
    <path d="M9 9.5c0 3 2.5 5.5 5.5 5.5.6 0 1-.5 1-1l-1.4-.8-1 .9a5 5 0 0 1-2.2-2.2l.9-1L11 9.5c0-.5-.4-1-1-1-.5 0-1 .4-1 1Z" />
  </Svg>
)

/* ---------- vitrine (traço fino, estilo editorial) ---------- */
export const SetaDiag = (p) => (
  <Svg {...p}>
    <path d="M7 17 17 7M8 7h9v9" />
  </Svg>
)
export const Chevron = (p) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
)
export const Ajustes = (p) => (
  <Svg {...p}>
    <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
    <circle cx="16" cy="7" r="2" />
    <circle cx="10" cy="17" r="2" />
  </Svg>
)
export const Escudo = (p) => (
  <Svg {...p}>
    <path d="M12 3 5 6v5c0 4.4 3 8.3 7 10 4-1.7 7-5.6 7-10V6l-7-3Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)
export const Instagram = (p) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </Svg>
)
/** asterisco de 8 pontas — assinatura visual da marca */
export const Asterisco = ({ size = 20, strokeWidth = 1.4, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" {...rest}>
    <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
  </svg>
)
/** brilho de 4 pontas, preenchido */
export const Brilho = ({ size = 16, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...rest}>
    <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
  </svg>
)
export const Estrela = ({ size = 10, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...rest}>
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9L12 2.5Z" />
  </svg>
)
export const CoracaoCheio = ({ size = 20, ...rest }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" {...rest}>
    <path d="M12 20s-7-4.3-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.7-7 9-7 9Z" />
  </svg>
)
