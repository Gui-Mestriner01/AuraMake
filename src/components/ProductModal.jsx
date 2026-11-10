import { useEffect, useRef, useState } from 'react'
import { STORE, CATEGORIAS } from '../config'
import { brl, esgotado, precoFinal, useLoja } from '../store/StoreContext'
import { abrirWhats } from '../whatsapp'
import ProductArt from './ProductArt'
import { Coracao, CoracaoCheio, Sacola, Whats, X } from './Icons'

/** Detalhe do produto em um cartão centralizado (abre ao tocar no item). */
export default function ProductModal({ produto, aoFechar, aoAdicionar }) {
  const { addCarrinho, alternarFavorito, ehFavorito, avisar } = useLoja()
  const cartaoRef = useRef(null)

  // guarda o último produto para a animação de saída não piscar vazia
  const [ultimo, setUltimo] = useState(produto)
  useEffect(() => {
    if (produto) setUltimo(produto)
  }, [produto])

  const aberto = !!produto

  useEffect(() => {
    if (!aberto) return
    const esc = (e) => e.key === 'Escape' && aoFechar()
    document.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    cartaoRef.current?.focus({ preventScroll: true })
    return () => {
      document.removeEventListener('keydown', esc)
      document.body.style.overflow = ''
    }
  }, [aberto, aoFechar])

  const p = produto ?? ultimo
  if (!p) return null

  const fora = esgotado(p)
  const fim = precoFinal(p)
  const off = (p.desconto || 0) > 0
  const fav = ehFavorito(p.id)
  const categoria = CATEGORIAS.find((c) => c.slug === p.categoria)?.nome ?? p.categoria

  const adicionar = () => {
    if (addCarrinho(p.id, 1) > 0) {
      aoFechar()
      aoAdicionar?.()
    } else {
      avisar('Você já tem na sacola todas as unidades disponíveis')
    }
  }

  const avisarChegada = () =>
    abrirWhats(
      `Olá! 😊 Vi no site da *${STORE.nome}* que o *${p.nome}* está esgotado.\n\n` +
        'Pode me avisar quando ele voltar? Fico no aguardo! 💕'
    )

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 ${aberto ? '' : 'pointer-events-none'}`}
      aria-hidden={!aberto}
    >
      <div
        onClick={aoFechar}
        className={`absolute inset-0 bg-ink/40 backdrop-blur-[3px] transition-opacity duration-300 ${
          aberto ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        ref={cartaoRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={p.nome}
        className={`relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-md flex-col overflow-y-auto overscroll-contain rounded-xl bg-cream outline-none shadow-lift transition duration-300 ease-[cubic-bezier(.22,1,.36,1)] md:max-w-3xl md:flex-row ${
          aberto ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[.97] opacity-0'
        }`}
      >
        {/* foto */}
        <div className="relative shrink-0 bg-blush md:w-1/2">
          <div className="h-[clamp(170px,31dvh,270px)] md:h-full md:min-h-[460px]">
            <ProductArt produto={p} className={`absolute inset-0 ${fora ? 'opacity-55 grayscale-[.4]' : ''}`} />
          </div>
          {fora && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-mute">
              Esgotado
            </span>
          )}
          <button
            onClick={aoFechar}
            className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-ink transition hover:bg-white/50 md:hidden"
            aria-label="Fechar"
          >
            <X size={26} />
          </button>
        </div>

        {/* informações */}
        <div className="relative flex flex-col px-6 pb-4 pt-5 sm:px-8 md:w-1/2 md:justify-center md:overflow-y-auto md:py-12">
          <button
            onClick={aoFechar}
            className="absolute right-4 top-4 hidden h-10 w-10 items-center justify-center rounded-full text-ink/70 transition hover:bg-blush hover:text-ink md:flex"
            aria-label="Fechar"
          >
            <X size={22} />
          </button>

          <p className="text-[11px] font-medium tracking-[0.18em] text-pink">{categoria}</p>
          <h2 className="mt-2 font-display text-[1.75rem] leading-[1.15] tracking-[-0.01em] text-ink sm:text-[2.1rem]">
            {p.nome}
          </h2>
          {p.descricao && <p className="mt-3 line-clamp-3 text-[14.5px] leading-relaxed text-ink/60 md:line-clamp-none">{p.descricao}</p>}

          <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
            {off && !fora && <span className="text-lg text-mute line-through">{brl(p.preco)}</span>}
            <span className={`text-[1.65rem] font-semibold ${fora ? 'text-mute' : 'text-pink'}`}>{brl(fim)}</span>
          </div>

          <p className="mt-2 text-sm text-mute">
            {fora
              ? 'Esgotado no momento'
              : `${p.estoque} ${p.estoque === 1 ? 'unidade disponível' : 'unidades disponíveis'}`}
          </p>

          <button
            onClick={fora ? avisarChegada : adicionar}
            className="mt-4 flex w-full shrink-0 items-center justify-center gap-3 rounded-[4px] bg-pink py-3.5 text-[15px] font-medium text-white transition hover:bg-pinkdeep active:scale-[.99]"
          >
            {fora ? (
              <>
                <Whats size={20} /> Avise-me quando chegar
              </>
            ) : (
              <>
                <Sacola size={20} /> Adicionar à sacola
              </>
            )}
          </button>

          <div className="mt-1.5 flex justify-center">
            <button
              onClick={() => alternarFavorito(p.id)}
              aria-pressed={fav}
              className={`flex items-center gap-2.5 py-2 text-sm transition ${fav ? 'text-pink' : 'text-ink/80 hover:text-pink'}`}
            >
              {fav ? <CoracaoCheio size={20} /> : <Coracao size={20} />}
              {fav ? 'Salvo nos favoritos' : 'Salvar nos favoritos'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
