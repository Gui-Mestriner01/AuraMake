import { useLoja } from '../store/StoreContext'
import { Check, X } from './Icons'

/** Aviso curto no rodapé da tela ("Blush Compacto Peach adicionado"). */
export default function Toast() {
  const { toast, fecharToast, abrirSacola } = useLoja()

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[5.25rem] z-[60] flex justify-center px-4 sm:bottom-7"
    >
      {toast && (
        <div
          key={toast.id}
          className="animate-toast pointer-events-auto flex max-w-full items-center gap-2.5 rounded-full bg-ink py-2 pl-4 pr-2 text-[13px] text-white shadow-lift"
        >
          <Check size={16} className="shrink-0 text-pessego" />
          <span className="truncate">{toast.texto}</span>
          {toast.sacola ? (
            <button
              onClick={() => {
                fecharToast()
                abrirSacola()
              }}
              className="shrink-0 rounded-full bg-white/15 px-3.5 py-1.5 font-medium transition hover:bg-white/25"
            >
              Ver sacola
            </button>
          ) : (
            <button onClick={fecharToast} className="shrink-0 rounded-full p-1.5 text-white/70 hover:text-white" aria-label="Fechar aviso">
              <X size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
