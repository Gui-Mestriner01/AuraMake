import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { STORE } from '../config'
import { useLoja } from '../store/StoreContext'
import { Asterisco, Coracao, Instagram, Lupa, Menu, Sacola, Whats, X } from './Icons'
import CartDrawer from './CartDrawer'
import { linkWhats, telefoneFormatado } from '../whatsapp'
import Logo from './Logo'

const links = [
  { to: '/', label: 'Início' },
  { to: '/loja?grupo=maquiagem', label: 'Maquiagem' },
  { to: '/loja?cat=skincare', label: 'Skincare' },
  { to: '/loja?novidades=1', label: 'Lançamentos' },
  { to: '/loja?sale=1', label: 'Sale', destaque: true }
]

function Busca({ aberta, fechar }) {
  const [termo, setTermo] = useState('')
  const nav = useNavigate()

  if (!aberta) return null

  const enviar = (e) => {
    e.preventDefault()
    nav(`/loja?q=${encodeURIComponent(termo.trim())}`)
    setTermo('')
    fechar()
  }

  return (
    <div className="border-t border-clay/70 bg-white">
      <form onSubmit={enviar} className="wrap flex items-center gap-3 py-3.5">
        <Lupa className="shrink-0 text-pink" />
        <input
          autoFocus
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="O que você procura?"
          className="w-full bg-transparent py-1 text-base outline-none placeholder:text-mute/60"
        />
        <button type="button" onClick={fechar} className="p-1 text-mute hover:text-ink" aria-label="Fechar busca">
          <X />
        </button>
      </form>
    </div>
  )
}

const Contador = ({ n }) =>
  n > 0 ? (
    <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pink px-1 text-[9px] font-semibold text-white">
      {n}
    </span>
  ) : null

function Marquee() {
  const frases = ['Beleza é ser você', 'Make your own glow']
  const faixa = [...frases, ...frases, ...frases]
  return (
    <div className="overflow-hidden bg-pink py-3.5 text-white" aria-hidden>
      <div className="flex w-max animate-marquee items-center [animation-duration:60s]">
        {[0, 1].map((k) => (
          <div key={k} className="flex items-center">
            {faixa.map((f, i) => (
              <span key={i} className="flex items-center">
                <span className="whitespace-nowrap px-7 font-display text-lg uppercase tracking-wide">{f}</span>
                <Asterisco size={16} strokeWidth={1.3} className="text-white/60" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Layout() {
  const { qtdCarrinho, favoritos } = useLoja()
  const [menu, setMenu] = useState(false)
  const [busca, setBusca] = useState(false)
  const [carrinho, setCarrinho] = useState(false)
  const { pathname, search } = useLocation()

  // volta ao topo ao trocar de página ou de filtro
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    setMenu(false)
  }, [pathname, search])

  const ativo = (to) => (to === '/' ? pathname === '/' && !search : pathname + search === to)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-blush py-2 text-center text-[11px] text-ink/75 sm:text-xs">
        Frete grátis acima de R$ {STORE.freteGratisAcima} · Cupom{' '}
        <strong className="font-semibold text-pink">{STORE.cupomBoasVindas}</strong> na primeira compra
      </div>

      <header className="sticky top-0 z-40 border-b border-clay/60 bg-white/95 backdrop-blur">
        <div className="wrap grid grid-cols-[1fr_auto_1fr] items-center py-3 sm:py-4">
          <button
            onClick={() => setMenu(true)}
            className="-ml-2 justify-self-start p-2 text-ink lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu />
          </button>

          <Link to="/" className="group justify-self-center lg:justify-self-start" aria-label={STORE.nome}>
            <Logo compacto />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className={`text-[13px] transition hover:text-pink ${
                  l.destaque || ativo(l.to) ? 'text-pink' : 'text-ink/75'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-self-end">
            <button onClick={() => setBusca((v) => !v)} className="p-2.5 text-ink transition hover:text-pink" aria-label="Buscar">
              <Lupa size={21} />
            </button>
            <Link
              to="/loja?fav=1"
              className="relative hidden p-2.5 text-ink transition hover:text-pink sm:block"
              aria-label="Favoritos"
            >
              <Coracao size={21} />
              <Contador n={favoritos.length} />
            </Link>
            <button
              onClick={() => setCarrinho(true)}
              className="relative -mr-2 p-2.5 text-ink transition hover:text-pink"
              aria-label="Abrir sacola"
            >
              <Sacola size={21} />
              <Contador n={qtdCarrinho} />
            </button>
          </div>
        </div>

        <Busca aberta={busca} fechar={() => setBusca(false)} />
      </header>

      {/* menu do celular */}
      <div className={`fixed inset-0 z-50 lg:hidden ${menu ? '' : 'pointer-events-none'}`}>
        <div
          onClick={() => setMenu(false)}
          className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${menu ? 'opacity-100' : 'opacity-0'}`}
        />
        <nav
          className={`absolute left-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-cream transition-[transform,box-shadow] duration-300 ${
            menu ? 'translate-x-0 shadow-lift' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <Logo compacto />
            <button onClick={() => setMenu(false)} className="-mr-2 p-2 text-mute" aria-label="Fechar menu">
              <X />
            </button>
          </div>

          <div className="flex flex-col px-3">
            {links.concat({ to: '/loja?fav=1', label: 'Favoritos' }).map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setMenu(false)}
                className={`rounded-md px-3 py-3 text-lg ${l.destaque || ativo(l.to) ? 'text-pink' : 'text-ink'}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto p-6">
            <a href={linkWhats()} target="_blank" rel="noreferrer" className="btn-rose w-full">
              <Whats size={17} /> Falar no WhatsApp
            </a>
          </div>
        </nav>
      </div>

      <main className="flex-1">
        <Outlet context={{ abrirCarrinho: () => setCarrinho(true) }} />
      </main>

      <Marquee />

      <footer className="bg-cream">
        <div className="wrap grid gap-10 py-14 sm:grid-cols-3">
          <div>
            <Link to="/" className="group inline-block" aria-label={STORE.nome}>
              <Logo compacto />
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-mute">{STORE.slogan}</p>
          </div>

          <div>
            <p className="mb-4 text-[13px] font-medium">Loja</p>
            <ul className="space-y-3 text-[13px] text-mute">
              <li><Link to="/loja?grupo=maquiagem" className="hover:text-pink">Maquiagem</Link></li>
              <li><Link to="/loja?cat=skincare" className="hover:text-pink">Skincare</Link></li>
              <li><Link to="/loja?sale=1" className="hover:text-pink">Sale</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[13px] font-medium">Atendimento</p>
            <ul className="space-y-3 text-[13px] text-mute">
              <li>
                <a href={linkWhats()} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-pink">
                  <Whats size={15} /> {telefoneFormatado}
                </a>
              </li>
              <li>
                <a href={`https://instagram.com/${STORE.instagram}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-pink">
                  <Instagram size={15} /> @{STORE.instagram}
                </a>
              </li>
              <li>Entrega em {STORE.regiao} e envio para todo o Brasil</li>
            </ul>
          </div>
        </div>

        <div className="wrap">
          <div className="flex flex-col items-center justify-between gap-2 border-t border-clay py-6 text-[11px] text-mute sm:flex-row">
            <span>© {new Date().getFullYear()} {STORE.nome}</span>
            <Link to="/admin" className="hover:text-pink">
              Área da proprietária
            </Link>
          </div>
        </div>
      </footer>

      <CartDrawer aberto={carrinho} aoFechar={() => setCarrinho(false)} />
    </div>
  )
}
