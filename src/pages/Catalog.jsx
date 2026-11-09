import { useMemo, useState } from 'react'
import { useOutletContext, useSearchParams } from 'react-router-dom'
import { CATEGORIAS } from '../config'
import { esgotado, precoFinal, useLoja } from '../store/StoreContext'
import ProductCard from '../components/ProductCard'
import ProductDrawer from '../components/ProductDrawer'

const ORDENS = [
  { id: 'relevancia', nome: 'Relevância' },
  { id: 'menor', nome: 'Menor preço' },
  { id: 'maior', nome: 'Maior preço' },
  { id: 'az', nome: 'A–Z' }
]

export default function Catalog() {
  const { produtos } = useLoja()
  const { abrirCarrinho } = useOutletContext()
  const [params, setParams] = useSearchParams()
  const [aberto, setAberto] = useState(null)
  const [ordem, setOrdem] = useState('relevancia')

  const cat = params.get('cat') || ''
  const q = (params.get('q') || '').toLowerCase().trim()
  const sale = params.get('sale') === '1'
  const novidades = params.get('novidades') === '1'

  const lista = useMemo(() => {
    let r = [...produtos]
    if (cat) r = r.filter((p) => p.categoria === cat)
    if (sale) r = r.filter((p) => (p.desconto || 0) > 0)
    if (novidades) r = r.filter((p) => p.selo === 'Novo')
    if (q) {
      r = r.filter((p) =>
        [p.nome, p.marca, p.descricao].join(' ').toLowerCase().includes(q)
      )
    }
    if (ordem === 'menor') r.sort((a, b) => precoFinal(a) - precoFinal(b))
    if (ordem === 'maior') r.sort((a, b) => precoFinal(b) - precoFinal(a))
    if (ordem === 'az') r.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    // esgotados sempre no fim
    return r.sort((a, b) => Number(esgotado(a)) - Number(esgotado(b)))
  }, [produtos, cat, q, sale, novidades, ordem])

  const trocarCat = (slug) => {
    const novo = new URLSearchParams(params)
    slug ? novo.set('cat', slug) : novo.delete('cat')
    novo.delete('sale')
    novo.delete('novidades')
    setParams(novo)
  }

  const titulo = sale
    ? 'Promoções'
    : novidades
      ? 'Lançamentos'
      : q
        ? `Resultados para “${q}”`
        : CATEGORIAS.find((c) => c.slug === cat)?.nome || 'Todos os produtos'

  return (
    <>
      <section className="wrap py-10 sm:py-14">
        <h1 className="font-display text-3xl sm:text-4xl">{titulo}</h1>
        <p className="mt-2 text-sm text-mute">
          {lista.length} {lista.length === 1 ? 'produto' : 'produtos'}
        </p>

        <div className="thin-scroll -mx-5 mt-7 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          <button
            onClick={() => trocarCat('')}
            className={`chip shrink-0 border px-4 py-2 text-xs ${
              !cat && !sale && !novidades
                ? 'border-ink bg-ink text-cream'
                : 'border-clay bg-white text-ink/80 hover:border-rose'
            }`}
          >
            Todos
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c.slug}
              onClick={() => trocarCat(c.slug)}
              className={`chip shrink-0 border px-4 py-2 text-xs ${
                cat === c.slug
                  ? 'border-ink bg-ink text-cream'
                  : 'border-clay bg-white text-ink/80 hover:border-rose'
              }`}
            >
              {c.nome}
            </button>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-end">
          <label className="flex items-center gap-2 text-xs text-mute">
            Ordenar
            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
              className="rounded-full border border-clay bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-rose"
            >
              {ORDENS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nome}
                </option>
              ))}
            </select>
          </label>
        </div>

        {lista.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-xl">Nada por aqui ainda</p>
            <p className="mt-2 text-sm text-mute">
              Tente outra categoria ou fale com a gente no WhatsApp — pode ser que a gente consiga
              encomendar.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
            {lista.map((p) => (
              <ProductCard key={p.id} produto={p} onAbrir={setAberto} />
            ))}
          </div>
        )}
      </section>

      <ProductDrawer produto={aberto} aoFechar={() => setAberto(null)} aoAdicionar={abrirCarrinho} />
    </>
  )
}
