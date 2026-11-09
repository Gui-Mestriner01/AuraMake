import { useEffect } from 'react'
import { X } from './Icons'

/** Gaveta lateral reutilizável (carrinho, detalhe do produto, edição no painel). */
export default function Drawer({ aberto, aoFechar, titulo, children, rodape, largura = 'max-w-md' }) {
  useEffect(() => {
    if (!aberto) return
    const esc = (e) => e.key === 'Escape' && aoFechar()
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [aberto, aoFechar])

  return (
    <div className={`fixed inset-0 z-50 ${aberto ? '' : 'pointer-events-none'}`} aria-hidden={!aberto}>
      <div
        onClick={aoFechar}
        className={`absolute inset-0 bg-ink/35 backdrop-blur-[2px] transition-opacity duration-300 ${
          aberto ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full ${largura} flex-col bg-cream shadow-lift transition-transform duration-300 ${
          aberto ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <header className="flex items-center justify-between border-b border-clay/70 px-5 py-4">
          <h2 className="font-display text-lg">{titulo}</h2>
          <button onClick={aoFechar} className="rounded-full p-2 text-mute hover:bg-sand hover:text-ink" aria-label="Fechar">
            <X />
          </button>
        </header>

        <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {rodape && <footer className="border-t border-clay/70 bg-white px-5 py-4">{rodape}</footer>}
      </aside>
    </div>
  )
}
