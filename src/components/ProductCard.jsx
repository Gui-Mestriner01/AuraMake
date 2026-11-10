import { useState } from 'react'
import { Link } from 'react-router-dom'
import { brl, esgotado, mediaDe, parcelamento, precoFinal, temTom, useLoja } from '../store/StoreContext'
import ProductArt from './ProductArt'
import Estrelas from './Estrelas'
import Tom from './Tom'
import { Check, Coracao, CoracaoCheio, Sacola } from './Icons'

export default function ProductCard({ produto, prioridade = false }) {
  const { alternarFavorito, ehFavorito, addCarrinho, avisar } = useLoja()
  const [ok, setOk] = useState(false)

  const fim = precoFinal(produto)
  const off = (produto.desconto || 0) > 0
  const fora = esgotado(produto)
  const fav = ehFavorito(produto.id)
  const parcela = parcelamento(fim)
  const media = mediaDe(produto.id)
  const link = `/produto/${produto.id}`

  const adicionar = () => {
    if (addCarrinho(produto.id, 1) > 0) {
      setOk(true)
      setTimeout(() => setOk(false), 1500)
      avisar(`${produto.nome} adicionado`, { sacola: true })
    } else {
      avisar('Você já tem na sacola todas as unidades disponíveis')
    }
  }

  const selo = fora ? 'Esgotado' : off ? `-${produto.desconto}%` : produto.selo === 'Novo' ? 'Novo' : ''

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-[1.4rem] bg-blush">
        <Link to={link} className="block aspect-[4/5] w-full" aria-label={`Ver ${produto.nome}`}>
          <ProductArt
            produto={produto}
            prioridade={prioridade}
            className={`transition duration-700 group-hover:scale-[1.04] ${fora ? 'opacity-50 grayscale-[.4]' : ''}`}
          />
        </Link>

        {selo && (
          <span
            className={`pointer-events-none absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold ${
              fora ? 'bg-white/90 text-mute' : off ? 'bg-laranja text-white' : 'bg-ink text-white'
            }`}
          >
            {selo}
          </span>
        )}

        <button
          type="button"
          onClick={() => alternarFavorito(produto.id)}
          className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur transition active:scale-90 ${
            fav ? 'text-pink' : 'text-ink/60 hover:text-pink'
          }`}
          aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          aria-pressed={fav}
        >
          {fav ? <CoracaoCheio size={17} /> : <Coracao size={17} />}
        </button>

        {!fora && (
          <button
            type="button"
            onClick={adicionar}
            className={`absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full text-white shadow-pink transition duration-200 hover:scale-110 active:scale-90 ${
              ok ? 'bg-ink' : 'bg-pink hover:bg-pinkdeep'
            }`}
            aria-label={`Adicionar ${produto.nome} à sacola`}
          >
            {ok ? <Check size={18} /> : <Sacola size={18} />}
          </button>
        )}
      </div>

      <div className="mt-3.5 px-1">
        <Link to={link} className="min-w-0 text-left">
          {temTom(produto) && produto.tomNome && (
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] text-mute">
              <Tom cor={produto.tom} size={12} />
              <span className="truncate">{produto.tomNome}</span>
            </p>
          )}
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink transition-colors group-hover:text-pink sm:text-[15px]">
            {produto.nome}
          </h3>
          {media && (
            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-mute">
              <Estrelas nota={media.nota} size={11} /> ({media.total})
            </p>
          )}
          <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
            <span className={`text-base font-semibold ${fora ? 'text-mute' : off ? 'text-pink' : 'text-ink'}`}>{brl(fim)}</span>
            {off && !fora && <span className="text-[11px] text-mute line-through">{brl(produto.preco)}</span>}
          </p>
          {parcela && !fora && (
            <p className="mt-0.5 text-[11px] text-mute">
              ou {parcela.vezes}x de {brl(parcela.valor)} sem juros
            </p>
          )}
        </Link>

      </div>
    </article>
  )
}
