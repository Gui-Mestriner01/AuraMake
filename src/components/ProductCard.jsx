import { useState } from 'react'
import { brl, esgotado, precoFinal, useLoja } from '../store/StoreContext'
import ProductArt from './ProductArt'
import { Check, Coracao, CoracaoCheio, Sacola } from './Icons'

export default function ProductCard({ produto, onAbrir }) {
  const { alternarFavorito, ehFavorito, addCarrinho } = useLoja()
  const [ok, setOk] = useState(false)

  const fim = precoFinal(produto)
  const off = (produto.desconto || 0) > 0
  const fora = esgotado(produto)
  const fav = ehFavorito(produto.id)

  const adicionar = () => {
    addCarrinho(produto.id, 1)
    setOk(true)
    setTimeout(() => setOk(false), 1500)
  }

  const selo = fora ? 'Esgotado' : off ? `-${produto.desconto}%` : produto.selo === 'Novo' ? 'Novo' : ''

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-[4px] bg-blush">
        <button
          type="button"
          onClick={() => onAbrir(produto)}
          className="block aspect-square w-full"
          aria-label={`Ver ${produto.nome}`}
        >
          <ProductArt
            produto={produto}
            className={`transition duration-700 group-hover:scale-[1.04] ${fora ? 'opacity-50 grayscale-[.4]' : ''}`}
          />
        </button>

        {selo && (
          <span
            className={`pointer-events-none absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-medium ${
              fora ? 'bg-white/90 text-mute' : off ? 'bg-laranja text-white' : 'bg-white/90 text-pink'
            }`}
          >
            {selo}
          </span>
        )}

        <button
          type="button"
          onClick={() => alternarFavorito(produto.id)}
          className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full transition active:scale-90 ${
            fav ? 'text-pink' : 'text-ink/50 hover:text-pink'
          }`}
          aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={fav}
        >
          {fav ? <CoracaoCheio size={18} /> : <Coracao size={18} />}
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <button type="button" onClick={() => onAbrir(produto)} className="min-w-0 text-left">
          <h3 className="line-clamp-2 text-[13px] leading-snug text-ink transition-colors group-hover:text-pink sm:text-sm">
            {produto.nome}
          </h3>
          <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
            <span className={`text-sm font-medium ${fora ? 'text-mute' : 'text-ink'}`}>{brl(fim)}</span>
            {off && !fora && <span className="text-[11px] text-mute line-through">{brl(produto.preco)}</span>}
          </p>
        </button>

        {!fora && (
          <button
            type="button"
            onClick={adicionar}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition active:scale-90 ${
              ok ? 'border-pink bg-pink text-white' : 'border-clay text-ink/70 hover:border-pink hover:text-pink'
            }`}
            aria-label={`Adicionar ${produto.nome} à sacola`}
          >
            {ok ? <Check size={16} /> : <Sacola size={16} />}
          </button>
        )}
      </div>
    </article>
  )
}
