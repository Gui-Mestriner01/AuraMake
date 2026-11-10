import { useEffect, useRef } from 'react'

/**
 * Revela o elemento (classe .reveal → .visivel) quando ele entra na tela.
 * Uso: const ref = useReveal(); <div ref={ref} className="reveal">…</div>
 * Filhos com .reveal dentro do mesmo container também são revelados.
 */
export default function useReveal() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const alvos = [el, ...el.querySelectorAll('.reveal')]
    if (!('IntersectionObserver' in window)) {
      alvos.forEach((a) => a.classList.add('visivel'))
      return
    }
    const obs = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visivel')
            obs.unobserve(e.target)
          }
        }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    )
    alvos.forEach((a) => obs.observe(a))
    return () => obs.disconnect()
  }, [])

  return ref
}
