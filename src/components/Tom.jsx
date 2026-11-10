/**
 * Bolinha do tom do produto, desenhada como uma pastilha de pó prensado
 * (brilho no canto + borda fina) para a cor não parecer um ponto chapado.
 */
export default function Tom({ cor, size = 14, className = '' }) {
  return (
    <span
      aria-hidden
      className={`inline-block shrink-0 rounded-full ring-1 ring-inset ring-ink/10 ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 26%, rgba(255,255,255,.42), rgba(255,255,255,0) 46%), ${cor}`
      }}
    />
  )
}
