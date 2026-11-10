import { Estrela } from './Icons'

/** Cinco estrelas, preenchidas até a nota (arredondada). */
export default function Estrelas({ nota, size = 13, className = '' }) {
  const cheias = Math.round(nota)
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} role="img" aria-label={`Nota ${nota.toFixed(1).replace('.', ',')} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Estrela key={n} size={size} className={n <= cheias ? 'text-laranja' : 'text-clay'} />
      ))}
    </span>
  )
}
