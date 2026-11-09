import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { STORE, CATEGORIAS } from '../config'
import { esgotado, useLoja } from '../store/StoreContext'
import ProductCard from '../components/ProductCard'
import ProductDrawer from '../components/ProductDrawer'
import ProductArt from '../components/ProductArt'
import { Caminhao, Coelho, Seta, Selo, Zap } from '../components/Icons'

const DIFERENCIAIS = [
  { Icone: Coelho, titulo: 'Cruelty-free', texto: 'Marcas que não testam em animais.' },
  { Icone: Selo, titulo: '100% original', texto: 'Direto de distribuidores autorizados.' },
  { Icone: Caminhao, titulo: 'Entrega rápida', texto: `${STORE.regiao} e todo o Brasil.` },
  { Icone: Zap, titulo: 'Atendimento real', texto: 'Dúvidas respondidas no WhatsApp.' }
]

function Hero() {
  const { produtos } = useLoja()
  const destaque = produtos.find((p) => !esgotado(p)) ?? produtos[0]

  return (
    <section className="relative overflow-hidden bg-sand/70">
      <div className="wrap grid items-center gap-10 py-14 sm:py-20 md:grid-cols-2 md:gap-6">
        <div className="animate-fade-up">
          <p className="text-[11px] uppercase tracking-[0.3em] text-mute">Coleção 2026</p>
          <h1 className="mt-4 font-display text-4xl font-light leading-[1.1] sm:text-5xl lg:text-6xl">
            A beleza que já
            <br />
            era sua.
          </h1>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-mute sm:text-base">
            Maquiagem e skincare selecionados um a um, com entrega em mãos em {STORE.regiao} e envio
            para todo o Brasil.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/loja" className="btn-dark">
              Conhecer coleção <Seta size={16} />
            </Link>
            <Link to="/loja?sale=1" className="btn-ghost">
              Ver ofertas
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm md:max-w-none">
          <div className="overflow-hidden rounded-[2rem] border border-clay/60 bg-white shadow-lift">
            <div className="aspect-[4/5]">
              <ProductArt produto={destaque} />
            </div>
          </div>
          <div className="absolute -bottom-4 left-4 rounded-2xl border border-clay/60 bg-cream px-4 py-3 shadow-soft sm:left-auto sm:right-6">
            <p className="text-[10px] uppercase tracking-widest text-mute">Em destaque</p>
            <p className="mt-0.5 max-w-[11rem] truncate text-sm">{destaque?.nome}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Atalhos() {
  const { produtos } = useLoja()

  return (
    <section className="wrap py-14 sm:py-16">
      <div className="grid grid-cols-5 gap-3 sm:gap-6">
        {CATEGORIAS.map((c) => {
          const amostra = produtos.find((p) => p.categoria === c.slug)
          return (
            <Link key={c.slug} to={`/loja?cat=${c.slug}`} className="group flex flex-col items-center gap-2.5">
              <div className="aspect-square w-full overflow-hidden rounded-full border border-clay/60 bg-sand transition group-hover:border-rose">
                <ProductArt produto={amostra} className="transition duration-500 group-hover:scale-110" />
              </div>
              <span className="text-center text-[11px] text-ink/80 sm:text-sm">{c.nome}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function Diferenciais() {
  return (
    <section className="border-y border-clay/70 bg-sand/50">
      <div className="wrap grid grid-cols-2 gap-6 py-12 lg:grid-cols-4">
        {DIFERENCIAIS.map(({ Icone, titulo, texto }) => (
          <div key={titulo} className="flex flex-col gap-2">
            <Icone size={22} className="text-rosedeep" />
            <p className="text-sm font-medium">{titulo}</p>
            <p className="text-xs leading-relaxed text-mute">{texto}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const { produtos } = useLoja()
  const { abrirCarrinho } = useOutletContext()
  const [aberto, setAberto] = useState(null)

  const destaques = produtos.slice(0, 8)
  const ofertas = produtos.filter((p) => (p.desconto || 0) > 0 && !esgotado(p)).slice(0, 4)

  return (
    <>
      <Hero />
      <Atalhos />

      <section className="wrap">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">Em destaque</h2>
            <p className="mt-1 text-sm text-mute">O que mais sai da prateleira esta semana.</p>
          </div>
          <Link to="/loja" className="shrink-0 text-sm text-rosedeep hover:underline">
            Ver tudo
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
          {destaques.map((p) => (
            <ProductCard key={p.id} produto={p} onAbrir={setAberto} />
          ))}
        </div>
      </section>

      {ofertas.length > 0 && (
        <section className="wrap mt-20">
          <div className="rounded-[2rem] bg-ink px-6 py-12 text-cream sm:px-10">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-cream/50">Sale</p>
                <h2 className="mt-2 font-display text-2xl sm:text-3xl">Promoções da semana</h2>
              </div>
              <Link to="/loja?sale=1" className="text-sm text-cream/70 hover:text-cream">
                Ver todas
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
              {ofertas.map((p) => (
                <div key={p.id} className="[&_h3]:text-cream [&_p]:text-cream/60 [&_span]:text-cream">
                  <ProductCard produto={p} onAbrir={setAberto} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="mt-20">
        <Diferenciais />
      </div>

      <ProductDrawer produto={aberto} aoFechar={() => setAberto(null)} aoAdicionar={abrirCarrinho} />
    </>
  )
}
