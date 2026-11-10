import { useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { STORE } from '../config'
import { useLoja } from '../store/StoreContext'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import useReveal from '../hooks/useReveal'
import { Caminhao, Escudo, Instagram, SetaDiag, Whats } from '../components/Icons'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden bg-blush">
      {/* foto: no celular fica em cima; no computador ocupa a metade direita */}
      <div className="relative h-[52svh] min-h-[340px] lg:absolute lg:inset-y-0 lg:left-[44%] lg:right-0 lg:h-auto">
        <img
          src="fotos/hero-1.webp"
          alt="Maquiagem rosa com pele iluminada"
          fetchpriority="high"
          className="h-full w-full object-cover object-[42%_30%]"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-blush to-transparent lg:inset-y-0 lg:left-0 lg:h-auto lg:w-48 lg:bg-gradient-to-r" />
      </div>

      <div className="wrap relative -mt-8 pb-14 lg:mt-0 lg:flex lg:min-h-[clamp(520px,calc(100svh-140px),640px)] lg:items-center lg:py-16">
        <div className="max-w-md">
          <p className="animate-fade-up text-[11px] font-medium uppercase tracking-eyebrow text-pink">
            Beleza que acontece em você
          </p>
          <h1 className="mt-5 font-display text-[2.9rem] font-light leading-[1] tracking-[-0.02em] text-ink sm:text-6xl xl:text-7xl">
            <span className="block animate-fade-up [animation-delay:80ms]">Sua beleza.</span>
            <em className="block animate-fade-up font-normal italic text-pink [animation-delay:140ms]">Seu momento.</em>
          </h1>
          <p className="mt-6 animate-fade-up text-[15px] leading-relaxed text-ink/65 [animation-delay:220ms]">
            Maquiagem e skincare originais, com entrega em {STORE.regiao} e envio para todo o Brasil.
          </p>
          <div className="mt-9 animate-fade-up [animation-delay:300ms]">
            <Link to="/loja" className="cta-pink">
              Ver produtos <SetaDiag size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Benefícios (uma linha discreta)                                     */
/* ------------------------------------------------------------------ */

const BENEFICIOS = [
  { Icone: Caminhao, texto: `Frete grátis acima de R$ ${STORE.freteGratisAcima}` },
  { Icone: Escudo, texto: 'Produtos 100% originais' },
  { Icone: Whats, texto: 'Atendimento pelo WhatsApp' }
]

function Beneficios() {
  return (
    <section className="border-b border-clay/70 bg-white">
      <div className="wrap grid grid-cols-3 gap-3 py-5 sm:py-6">
        {BENEFICIOS.map(({ Icone, texto }) => (
          <div
            key={texto}
            className="flex flex-col items-center gap-2 text-center text-[11px] leading-snug text-ink/70 sm:flex-row sm:justify-center sm:gap-3 sm:text-left sm:text-[13px]"
          >
            <Icone size={19} className="shrink-0 text-pink" />
            {texto}
          </div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Categorias                                                          */
/* ------------------------------------------------------------------ */

const ATALHOS = [
  { slug: 'pele', nome: 'Pele', img: 'fotos/blush.webp' },
  { slug: 'olhos', nome: 'Olhos', img: 'fotos/mascara.webp' },
  { slug: 'labios', nome: 'Lábios', img: 'fotos/gloss.webp' },
  { slug: 'skincare', nome: 'Skincare', img: 'fotos/serum.webp' },
  { slug: 'pinceis', nome: 'Pincéis', img: 'fotos/pinceis.webp' }
]

function Categorias() {
  const ref = useReveal()
  return (
    <section ref={ref} className="py-16 sm:py-20">
      <div className="wrap">
        <h2 className="reveal titulo text-center">
          Por onde <em>começamos?</em>
        </h2>

        <div className="sem-scroll -mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-auto sm:grid sm:max-w-4xl sm:grid-cols-5 sm:gap-8 sm:overflow-visible sm:px-0">
          {ATALHOS.map((c, i) => (
            <Link
              key={c.slug}
              to={`/loja?cat=${c.slug}`}
              className="reveal group flex w-[27vw] max-w-[120px] shrink-0 snap-start flex-col items-center sm:w-auto sm:max-w-none"
              style={{ '--d': `${i * 70}ms` }}
            >
              <div className="aspect-square w-full overflow-hidden rounded-full bg-blush">
                <img
                  src={c.img}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 text-sm text-ink/80 transition-colors group-hover:text-pink">{c.nome}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Produtos em destaque                                                */
/* ------------------------------------------------------------------ */

function Destaques({ onAbrir }) {
  const { produtos } = useLoja()
  const ref = useReveal()
  const lista = produtos.slice(0, 8)

  return (
    <section className="border-t border-clay/60 py-16 sm:py-20">
      <div className="wrap">
        <div ref={ref} className="reveal flex items-end justify-between gap-4">
          <h2 className="titulo">
            Os queridinhos <em>da vez.</em>
          </h2>
          <Link
            to="/loja"
            className="group hidden shrink-0 items-center gap-2 text-sm text-ink/70 transition hover:text-pink sm:inline-flex"
          >
            Ver todos
            <SetaDiag size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
          {lista.map((p) => (
            <ProductCard key={p.id} produto={p} onAbrir={onAbrir} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/loja" className="btn-ghost px-7">
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Banner skincare                                                     */
/* ------------------------------------------------------------------ */

function BannerSkincare() {
  const ref = useReveal()
  return (
    <section className="wrap pb-16 sm:pb-20">
      <div ref={ref} className="reveal grid overflow-hidden rounded-md bg-blush lg:grid-cols-2">
        <div className="relative min-h-[260px] sm:min-h-[380px]">
          <img
            src="fotos/banner-skincare.webp"
            alt="Sérum facial entre pêssegos"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-7 py-12 sm:px-14">
          <h2 className="titulo">
            Uma pausa.
            <br />
            <em>Todo o seu brilho.</em>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink/65">
            Encontre o cuidado que combina com a sua pele.
          </p>
          <div className="mt-8">
            <Link to="/loja?cat=skincare" className="cta-ink">
              Ver skincare <SetaDiag size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Inspire-se                                                          */
/* ------------------------------------------------------------------ */

const GALERIA = [
  { img: 'fotos/insp-blush.webp', alt: 'Aplicando blush' },
  { img: 'fotos/insp-olho.webp', alt: 'Sombra rosa e dourada' },
  { img: 'fotos/insp-cores.webp', alt: 'Swatches de batom' },
  { img: 'fotos/insp-flatlay.webp', alt: 'Maquiagem em fundo rosa' }
]

function Inspire() {
  const ref = useReveal()
  return (
    <section ref={ref} className="pb-16 sm:pb-20">
      <div className="wrap">
        <div className="reveal flex items-end justify-between gap-4">
          <h2 className="titulo">
            Inspire-se <em>com a gente.</em>
          </h2>
          <a
            href={`https://instagram.com/${STORE.instagram}`}
            target="_blank"
            rel="noreferrer"
            className="hidden shrink-0 items-center gap-2 text-sm text-ink/70 transition hover:text-pink sm:inline-flex"
          >
            <Instagram size={17} /> @{STORE.instagram}
          </a>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GALERIA.map((g, i) => (
            <a
              key={g.img}
              href={`https://instagram.com/${STORE.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="reveal group block aspect-square overflow-hidden rounded-[4px] bg-blush"
              style={{ '--d': `${i * 70}ms` }}
            >
              <img
                src={g.img}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export default function Home() {
  const { abrirCarrinho } = useOutletContext()
  const [aberto, setAberto] = useState(null)
  const { produtos } = useLoja()

  // mantém o produto aberto sincronizado com o estoque/preço atual
  const produtoAberto = aberto ? produtos.find((p) => p.id === aberto.id) ?? null : null

  return (
    <>
      <Hero />
      <Beneficios />
      <Categorias />
      <Destaques onAbrir={setAberto} />
      <BannerSkincare />
      <Inspire />

      <ProductModal produto={produtoAberto} aoFechar={() => setAberto(null)} aoAdicionar={abrirCarrinho} />
    </>
  )
}
