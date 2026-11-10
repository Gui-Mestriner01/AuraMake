import { Link } from 'react-router-dom'
import { STORE } from '../config'
import { AVALIACOES } from '../data/avaliacoes'
import { esgotado, temTom, useLoja } from '../store/StoreContext'
import useTitulo from '../hooks/useTitulo'
import ProductCard from '../components/ProductCard'
import Estrelas from '../components/Estrelas'
import Tom from '../components/Tom'
import { Caminhao, Escudo, Instagram, SetaDiag, Whats } from '../components/Icons'

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

/** Selo giratório do cupom, colado na foto do hero. */
function Selo() {
  return (
    <div className="absolute -bottom-7 -left-9 h-32 w-32 sm:-left-14 sm:h-40 sm:w-40" aria-hidden>
      <svg viewBox="0 0 120 120" className="h-full w-full drop-shadow-lg">
        <circle cx="60" cy="60" r="60" fill="#F26A21" />
        <defs>
          <path id="selo-arco" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
        </defs>
        <g className="animate-girar" style={{ transformOrigin: '60px 60px' }}>
          <text fontSize="9.5" fontWeight="700" fill="#2A0E1B" textLength="276" lengthAdjust="spacing">
            <textPath href="#selo-arco" textLength="276" lengthAdjust="spacing">
              NA PRIMEIRA COMPRA ✳ CUPOM {STORE.cupomBoasVindas} ✳
            </textPath>
          </text>
        </g>
        <text
          x="60"
          y="71"
          textAnchor="middle"
          fontSize="32"
          fontWeight="700"
          fontStyle="italic"
          fill="#fff"
          style={{ fontFamily: '"Bodoni Moda", Georgia, serif' }}
        >
          {STORE.cupomDesconto}%
        </text>
      </svg>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-pink text-white">
      <div className="wrap grid items-center gap-14 pb-20 pt-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-8 lg:py-20">
        <div>
          <h1 className="font-display text-[3.7rem] font-medium leading-[.9] tracking-[-0.035em] sm:text-[5.5rem] xl:text-[7.25rem]">
            <span className="block animate-fade-up">Sua beleza.</span>
            <em className="block animate-fade-up italic text-pessego [animation-delay:90ms]">Seu momento.</em>
          </h1>
          <p className="mt-7 max-w-[34ch] animate-fade-up text-base leading-relaxed text-white/85 [animation-delay:180ms] sm:text-lg">
            Maquiagem e skincare originais, com entrega em {STORE.regiao} e envio para todo o Brasil.
          </p>
          <div className="mt-9 flex animate-fade-up flex-wrap items-center gap-x-7 gap-y-4 [animation-delay:260ms]">
            <Link to="/loja" className="cta bg-white text-pink hover:bg-ink hover:text-white">
              Ver produtos <SetaDiag size={17} />
            </Link>
            <Link to="/loja?sale=1" className="text-sm font-medium underline decoration-pessego decoration-2 underline-offset-[7px] hover:text-pessego">
              Ofertas da semana
            </Link>
          </div>
        </div>

        {/* foto em arco, a forma que se repete nas categorias e no banner */}
        <div className="relative mx-auto w-[74%] max-w-[400px] lg:mr-4">
          <div className="aspect-[4/5] overflow-hidden rounded-b-[2.5rem] rounded-t-full bg-pinkdeep ring-[10px] ring-white/20">
            <img
              src="/fotos/hero-1.webp"
              alt="Maquiagem rosa com pele iluminada"
              fetchpriority="high"
              className="h-full w-full object-cover object-[68%_30%]"
            />
          </div>
          <Selo />
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Benefícios (uma linha discreta)                                     */
/* ------------------------------------------------------------------ */

const BENEFICIOS = [
  { Icone: Caminhao, texto: `Frete grátis acima de R$ ${STORE.freteGratisAcima}`, to: '/ajuda#entrega' },
  { Icone: Escudo, texto: 'Produtos originais e lacrados', to: '/ajuda#trocas' },
  { Icone: Whats, texto: 'Atendimento pelo WhatsApp', to: '/ajuda#contato' }
]

function Beneficios() {
  return (
    <section className="bg-ink text-cream">
      <div className="wrap grid grid-cols-3 gap-3 py-5 sm:py-6">
        {BENEFICIOS.map(({ Icone, texto, to }) => (
          <Link
            key={texto}
            to={to}
            className="flex flex-col items-center gap-2 text-center text-[11px] leading-snug text-cream/85 transition hover:text-pessego sm:flex-row sm:justify-center sm:gap-3 sm:text-left sm:text-sm"
          >
            <Icone size={20} className="shrink-0 text-pessego" />
            {texto}
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Categorias                                                          */
/* ------------------------------------------------------------------ */

const ATALHOS = [
  { slug: 'pele', nome: 'Pele', img: '/fotos/blush.webp' },
  { slug: 'olhos', nome: 'Olhos', img: '/fotos/mascara.webp' },
  { slug: 'labios', nome: 'Lábios', img: '/fotos/gloss.webp' },
  { slug: 'skincare', nome: 'Skincare', img: '/fotos/serum.webp' },
  { slug: 'pinceis', nome: 'Pincéis', img: '/fotos/pinceis.webp' }
]

function Categorias() {
  return (
    <section className="py-14 sm:py-20">
      <div className="wrap">
        <h2 className="titulo">Por onde começamos?</h2>

        <div className="sem-scroll -mx-4 mt-10 flex snap-x gap-3.5 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-5 sm:gap-6 sm:overflow-visible sm:px-0">
          {ATALHOS.map((c) => (
            <Link
              key={c.slug}
              to={`/loja?cat=${c.slug}`}
              className="group flex w-[36vw] max-w-[160px] shrink-0 snap-start flex-col items-center sm:w-auto sm:max-w-none"
            >
              <div className="aspect-[3/4] w-full overflow-hidden rounded-b-3xl rounded-t-full bg-blush">
                <img src={c.img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <p className="mt-4 font-display text-xl font-medium italic transition-colors group-hover:text-pink sm:text-2xl">{c.nome}</p>
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

function Destaques() {
  const { produtos } = useLoja()
  const lista = produtos.slice(0, 8)

  return (
    <section className="pb-14 sm:pb-20">
      <div className="wrap">
        <div className="flex items-end justify-between gap-4">
          <h2 className="titulo">Os queridinhos da vez</h2>
          <Link
            to="/loja"
            className="group hidden shrink-0 items-center gap-2 text-sm text-ink/70 transition hover:text-pink sm:inline-flex"
          >
            Ver todos
            <SetaDiag size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-6 lg:grid-cols-4">
          {lista.map((p, i) => (
            <ProductCard key={p.id} produto={p} prioridade={i < 4} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/loja" className="cta-ink">
            Ver todos os produtos
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Escolha pelo tom — a cor de cada produto como uma pastilha          */
/* ------------------------------------------------------------------ */

function Tons() {
  const { produtos } = useLoja()
  const lista = produtos.filter((p) => temTom(p) && p.tomNome && !esgotado(p))
  if (lista.length < 3) return null

  return (
    <section className="bg-ink py-14 text-cream sm:py-20">
      <div className="wrap">
        <h2 className="font-display text-[2.35rem] font-medium leading-none tracking-[-0.025em] sm:text-[3.5rem]">
          Escolha pelo tom
        </h2>
        <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-cream/60">
          A cor de verdade de cada produto. Toque em uma para ver os detalhes.
        </p>

        <div className="sem-scroll -mx-4 mt-10 flex gap-6 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:gap-x-9 sm:gap-y-10 sm:overflow-visible sm:px-0">
          {lista.map((p) => (
            <Link key={p.id} to={`/produto/${p.id}`} className="group flex w-[5.5rem] shrink-0 flex-col items-center text-center sm:w-28">
              <span className="rounded-full p-1.5 ring-1 ring-cream/15 transition duration-300 group-hover:ring-cream/70">
                <Tom cor={p.tom} size={72} className="!ring-0 transition duration-300 group-hover:scale-[1.06]" />
              </span>
              <span className="mt-3.5 text-[13px] leading-tight">{p.tomNome}</span>
              <span className="mt-1 line-clamp-2 text-[11px] leading-snug text-cream/50">{p.nome}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Banner skincare                                                     */
/* ------------------------------------------------------------------ */

function BannerSkincare() {
  return (
    <section className="wrap py-14 sm:py-20">
      <div className="grid items-center gap-8 overflow-hidden rounded-[2.5rem] bg-pessego p-6 sm:p-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-14 lg:p-14">
        <div className="relative mx-auto aspect-[4/5] w-[70%] max-w-[340px] overflow-hidden rounded-b-[2rem] rounded-t-full lg:w-full">
          <img
            src="/fotos/banner-skincare.webp"
            alt="Sérum facial entre pêssegos"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center pb-4 lg:pb-0">
          <h2 className="titulo">
            Uma pausa.
            <br />
            <em className="italic text-pink">Todo o seu brilho.</em>
          </h2>
          <p className="mt-5 max-w-sm text-base leading-relaxed text-ink/75">
            Sérum, hidratante e o cuidado que combina com a sua pele.
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
/* Como funciona o pedido (é uma sequência de verdade: 1 → 2 → 3)      */
/* ------------------------------------------------------------------ */

const PASSOS = [
  { titulo: 'Monte a sacola', texto: 'Escolha os produtos, a forma de entrega e como quer pagar.' },
  { titulo: 'Envie pelo WhatsApp', texto: 'O site abre a conversa com o pedido pronto. É só apertar enviar.' },
  { titulo: 'Combine e receba', texto: 'Confirmamos o estoque e o prazo, você paga e recebe em casa.' }
]

function ComoFunciona() {
  return (
    <section className="bg-blush py-14 sm:py-20">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="titulo">Como funciona o pedido</h2>
          <Link to="/ajuda" className="text-sm text-ink/70 underline decoration-clay underline-offset-4 transition hover:text-pink hover:decoration-pink">
            Entrega, trocas e pagamento
          </Link>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-5">
          {PASSOS.map((p, i) => (
            <li key={p.titulo} className="flex gap-5 rounded-3xl bg-white p-6 sm:block sm:p-8">
              <span className="font-display text-6xl font-medium italic leading-none text-laranja sm:text-7xl">{i + 1}</span>
              <div className="sm:mt-5">
                <h3 className="text-lg font-semibold">{p.titulo}</h3>
                <p className="mt-1.5 max-w-[34ch] text-sm leading-relaxed text-mute">{p.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Depoimentos (só aparece quando existir avaliação em data/avaliacoes)*/
/* ------------------------------------------------------------------ */

function Depoimentos() {
  const { produtos } = useLoja()
  const lista = AVALIACOES.slice(0, 3)
  if (lista.length === 0) return null

  return (
    <section className="py-14 sm:py-20">
      <div className="wrap">
        <h2 className="titulo">Quem comprou, conta</h2>
        <ul className="mt-9 grid gap-4 sm:grid-cols-3">
          {lista.map((a, i) => {
            const prod = produtos.find((p) => p.id === a.produto)
            return (
              <li key={i} className="flex flex-col rounded-xl border border-clay/70 bg-white p-6">
                <Estrelas nota={a.nota} size={14} />
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/80">“{a.texto}”</p>
                <p className="mt-5 text-[13px] text-mute">
                  <span className="font-medium text-ink">{a.nome}</span>
                  {a.cidade && `, ${a.cidade}`}
                </p>
                {prod && (
                  <Link to={`/produto/${prod.id}`} className="mt-1 text-[13px] text-pink hover:underline">
                    {prod.nome}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Inspire-se                                                          */
/* ------------------------------------------------------------------ */

const GALERIA = [
  { img: '/fotos/insp-blush.webp', alt: 'Aplicando blush', to: '/loja?cat=pele' },
  { img: '/fotos/insp-olho.webp', alt: 'Sombra rosa e dourada', to: '/loja?cat=olhos' },
  { img: '/fotos/insp-cores.webp', alt: 'Swatches de batom', to: '/loja?cat=labios' },
  { img: '/fotos/insp-flatlay.webp', alt: 'Maquiagem em fundo rosa', to: '/loja?grupo=maquiagem' }
]

function Inspire() {
  const insta = STORE.instagram ? `https://instagram.com/${STORE.instagram}` : null
  return (
    <section className="py-14 sm:py-20">
      <div className="wrap">
        <div className="flex items-end justify-between gap-4">
          <h2 className="titulo">Inspire-se com a gente</h2>
          {insta && (
            <a
              href={insta}
              target="_blank"
              rel="noreferrer"
              className="hidden shrink-0 items-center gap-2 text-sm text-ink/70 transition hover:text-pink sm:inline-flex"
            >
              <Instagram size={17} /> @{STORE.instagram}
            </a>
          )}
        </div>

        <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {GALERIA.map((g) => {
            const img = (
              <img
                src={g.img}
                alt={g.alt}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            )
            const classe = 'group block aspect-square overflow-hidden rounded-3xl bg-blush'
            return insta ? (
              <a key={g.img} href={insta} target="_blank" rel="noreferrer" className={classe}>
                {img}
              </a>
            ) : (
              <Link key={g.img} to={g.to} className={classe}>
                {img}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */

export default function Home() {
  useTitulo('')
  return (
    <>
      <Hero />
      <Beneficios />
      <Categorias />
      <Destaques />
      <Tons />
      <BannerSkincare />
      <ComoFunciona />
      <Depoimentos />
      <Inspire />
    </>
  )
}
