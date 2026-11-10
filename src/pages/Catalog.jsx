import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CATEGORIAS, STORE } from '../config'
import { esgotado, precoFinal, semAcento, useLoja } from '../store/StoreContext'
import useTitulo from '../hooks/useTitulo'
import ProductCard from '../components/ProductCard'
import { Chevron, Whats } from '../components/Icons'
import { linkWhats } from '../whatsapp'

const ORDENS = [
  { id: 'relevancia', nome: 'Relevância' },
  { id: 'menor', nome: 'Menor preço' },
  { id: 'maior', nome: 'Maior preço' },
  { id: 'az', nome: 'A–Z' }
]

export default function Catalog() {
  const { produtos, favoritos } = useLoja()
  const [params, setParams] = useSearchParams()
  const [ordem, setOrdem] = useState('relevancia')

  const cat = params.get('cat') || ''
  const grupo = params.get('grupo') || ''
  const q = (params.get('q') || '').trim()
  const sale = params.get('sale') === '1'
  const novidades = params.get('novidades') === '1'
  const fav = params.get('fav') === '1'

  const lista = useMemo(() => {
    let r = [...produtos]
    if (cat) r = r.filter((p) => p.categoria === cat)
    if (grupo === 'maquiagem') r = r.filter((p) => p.categoria !== 'skincare')
    if (sale) r = r.filter((p) => (p.desconto || 0) > 0)
    if (novidades) r = r.filter((p) => p.selo === 'Novo')
    if (fav) r = r.filter((p) => favoritos.includes(p.id))
    if (q) r = r.filter((p) => semAcento([p.nome, p.marca, p.tomNome, CATEGORIAS.find((c) => c.slug === p.categoria)?.nome, p.descricao].join(' ')).includes(semAcento(q)))
    if (ordem === 'menor') r.sort((a, b) => precoFinal(a) - precoFinal(b))
    if (ordem === 'maior') r.sort((a, b) => precoFinal(b) - precoFinal(a))
    if (ordem === 'az') r.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    // esgotados sempre no fim
    return r.sort((a, b) => Number(esgotado(a)) - Number(esgotado(b)))
  }, [produtos, favoritos, cat, grupo, q, sale, novidades, fav, ordem])

  const trocarCat = (slug) => setParams(slug ? { cat: slug } : {})

  const titulo = sale
    ? 'Sale'
    : novidades
      ? 'Lançamentos'
      : fav
        ? 'Favoritos'
        : q
          ? `Resultados para “${q}”`
          : grupo === 'maquiagem'
            ? 'Maquiagem'
            : CATEGORIAS.find((c) => c.slug === cat)?.nome || 'Todos os produtos'

  const semFiltro = !cat && !sale && !novidades && !fav && !grupo && !q
  // em Favoritos sem nenhum item, os filtros de categoria não têm o que filtrar
  const mostrarFiltros = !(fav && favoritos.length === 0)
  useTitulo(titulo)

  return (
    <>
      <section className="wrap pb-16 pt-10 sm:pt-14">
        <h1 className="font-display text-[2.8rem] font-medium leading-none tracking-[-0.03em] sm:text-7xl">
          {titulo}
          <span className="text-pink">.</span>
        </h1>
        <div className="mt-2 flex items-center justify-between gap-4">
          <p className="text-sm text-mute">
            {lista.length} {lista.length === 1 ? 'produto' : 'produtos'}
          </p>
          <label className="relative flex shrink-0 items-center">
            <select
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
              className="cursor-pointer appearance-none bg-transparent py-2 pl-2 pr-6 text-[13px] text-ink/70 outline-none"
              aria-label="Ordenar produtos"
            >
              {ORDENS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nome}
                </option>
              ))}
            </select>
            <Chevron size={14} className="pointer-events-none absolute right-0 text-ink/60" />
          </label>
        </div>

        {mostrarFiltros && (
        <div className="mt-6 border-b border-clay/70 pb-4">
          <div className="sem-scroll -mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            {[{ slug: '', nome: 'Todos' }, ...CATEGORIAS].map((c) => {
              const ativo = c.slug ? cat === c.slug : semFiltro
              return (
                <button
                  key={c.slug || 'todos'}
                  onClick={() => trocarCat(c.slug)}
                  className={`shrink-0 rounded-full px-4 py-2 text-[13px] transition ${
                    ativo ? 'bg-pink text-white' : 'text-ink/70 hover:bg-blush hover:text-pink'
                  }`}
                >
                  {c.nome}
                </button>
              )
            })}
          </div>
        </div>
        )}

        {lista.length === 0 ? (
          <div className="mx-auto max-w-sm py-24 text-center">
            <p className="font-display text-2xl font-light">
              {fav ? 'Nenhum favorito ainda' : q ? 'Nada encontrado' : 'Nada por aqui ainda'}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-mute">
              {fav
                ? 'Toque no coração dos produtos que você gostar para guardá-los aqui.'
                : 'Tente outra categoria ou fale com a gente — pode ser que a gente consiga encomendar.'}
            </p>
            <div className="mt-7 flex justify-center gap-2">
              <Link to="/loja" className="btn-ghost text-xs">
                Ver todos os produtos
              </Link>
              {!fav && (
                <a
                  href={linkWhats(
                    q
                      ? `Olá! Procurei por "${q}" no site da *${STORE.nome}* e não encontrei. Vocês têm ou conseguem encomendar? 😊`
                      : undefined
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-rose text-xs"
                >
                  <Whats size={16} /> WhatsApp
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
            {lista.map((p, i) => (
              <ProductCard key={p.id} produto={p} prioridade={i < 8} />
            ))}
          </div>
        )}
      </section>

    </>
  )
}
